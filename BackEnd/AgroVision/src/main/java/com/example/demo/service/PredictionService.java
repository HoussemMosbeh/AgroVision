package com.example.demo.service;

import com.example.demo.dto.PredictionDTO;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final fieldRepository fieldRepository;
    private final soilRepository soilRepository;
    private final TerrainPlanteRepository terrainPlanteRepository;
    private final RestTemplate restTemplate;

    @Value("${xgboost.service.url}")
    private String xgboostUrl;

    public PredictionService(PredictionRepository predictionRepository,
                             fieldRepository fieldRepository,
                             soilRepository soilRepository,
                             TerrainPlanteRepository terrainPlanteRepository,
                             RestTemplate restTemplate) {
        this.predictionRepository    = predictionRepository;
        this.fieldRepository         = fieldRepository;
        this.soilRepository          = soilRepository;
        this.terrainPlanteRepository = terrainPlanteRepository;
        this.restTemplate            = restTemplate;
    }

    public PredictionDTO predict(Long terrainId) {
        fieldModel terrain = fieldRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain not found"));

        List<soilModel> soils = soilRepository.findByFieldId(terrainId);
        if (soils.isEmpty()) throw new RuntimeException("No soil metrics for this terrain");
        soilModel soil = soils.get(soils.size() - 1);

        List<TerrainPlanteModel> cultures = terrainPlanteRepository.findByTerrainId(terrainId);
        if (cultures.isEmpty()) throw new RuntimeException("No crop associated with this terrain");
        TerrainPlanteModel culture = cultures.get(0);
        PlanteModel plante = culture.getPlante();

        Map<String, Object> body = new HashMap<>();
        body.put("nom_plante",                plante.getNomPlante());
        body.put("type_plante",               plante.getTypePlante());
        body.put("superficie_hectare",        terrain.getSurface().doubleValue());
        body.put("latitude",                  terrain.getLatitude().doubleValue());
        body.put("longitude",                 terrain.getLongitude().doubleValue());
        body.put("ph",                        soil.getPh().doubleValue());
        body.put("azote_ppm",                 soil.getAzote().doubleValue());
        body.put("phosphore_ppm",             soil.getPhosphore().doubleValue());
        body.put("potassium_ppm",             soil.getPotassium().doubleValue());
        body.put("humidite_percent",          soil.getHumidite().doubleValue());
        body.put("matiere_organique_percent", soil.getMatiere_organique() != null ? soil.getMatiere_organique().doubleValue() : 2.0);
        body.put("temperature_celsius",       soil.getTemperature().doubleValue());
        body.put("year",                      LocalDate.now().getYear());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                xgboostUrl + "/predict", HttpMethod.POST, request, Map.class);

        Map<String, Object> result = response.getBody();
        Map<String, Double> proba  = (Map<String, Double>) result.get("quality_probabilities");
        Map<String, Double> climate = (Map<String, Double>) result.get("climate_used");

        PredictionModel prediction = new PredictionModel();
        prediction.setTerrain(terrain);
        prediction.setPlante(plante);
        prediction.setSol(soil);
        prediction.setYieldTons(((Number) result.get("yield_tons_per_hectare")).doubleValue());
        prediction.setQuality((String) result.get("quality"));
        prediction.setQualityProbaLow(proba.get("low"));
        prediction.setQualityProbaMedium(proba.get("medium"));
        prediction.setQualityProbaHigh(proba.get("high"));
        prediction.setAvgTemp(climate.get("avg_temp"));
        prediction.setTotalRain(climate.get("total_rain"));
        prediction.setAvgHumidity(climate.get("avg_humidity"));
        prediction.setAvgRadiation(climate.get("avg_radiation"));
        prediction.setYear(LocalDate.now().getYear());
        prediction.setModelVersion("xgboost-v1");

        PredictionModel saved = predictionRepository.save(prediction);
        return toDTO(saved);
    }

    public List<PredictionDTO> getByTerrain(Long terrainId) {
        return predictionRepository.findByTerrainId(terrainId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PredictionDTO> getAll() {
        return predictionRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private PredictionDTO toDTO(PredictionModel p) {
        PredictionDTO dto = new PredictionDTO();
        dto.setId(p.getId());
        dto.setTerrainId(p.getTerrain().getId());
        dto.setPlanteId(p.getPlante() != null ? p.getPlante().getId() : null);
        dto.setSolId(p.getSol() != null ? p.getSol().getId() : null);
        dto.setYieldTons(p.getYieldTons());
        dto.setQuality(p.getQuality());
        dto.setQualityProbaLow(p.getQualityProbaLow());
        dto.setQualityProbaMedium(p.getQualityProbaMedium());
        dto.setQualityProbaHigh(p.getQualityProbaHigh());
        dto.setAvgTemp(p.getAvgTemp());
        dto.setTotalRain(p.getTotalRain());
        dto.setAvgHumidity(p.getAvgHumidity());
        dto.setAvgRadiation(p.getAvgRadiation());
        dto.setPredictedAt(p.getPredictedAt());
        dto.setYear(p.getYear());
        dto.setModelVersion(p.getModelVersion());
        return dto;
    }
}