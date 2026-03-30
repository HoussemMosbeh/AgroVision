package com.example.demo.service;

import com.example.demo.model.fieldModel;
import com.example.demo.model.PlanteModel;
import com.example.demo.model.TerrainPlanteModel;
import com.example.demo.repository.fieldRepository;
import com.example.demo.repository.PlanteRepository;
import com.example.demo.repository.TerrainPlanteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TerrainPlanteService {

    private final TerrainPlanteRepository terrainPlanteRepository;
    private final fieldRepository fieldRepository;
    private final PlanteRepository planteRepository;

    public TerrainPlanteService(TerrainPlanteRepository terrainPlanteRepository,
                                 fieldRepository fieldRepository,
                                 PlanteRepository planteRepository) {
        this.terrainPlanteRepository = terrainPlanteRepository;
        this.fieldRepository = fieldRepository;
        this.planteRepository = planteRepository;
    }

    public TerrainPlanteModel planterCulture(Long terrainId, Long planteId, java.time.LocalDate datePlantation) {
        fieldModel terrain = fieldRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé"));
        PlanteModel plante = planteRepository.findById(planteId)
                .orElseThrow(() -> new RuntimeException("Plante non trouvée"));

        TerrainPlanteModel tp = new TerrainPlanteModel();
        tp.setTerrain(terrain);
        tp.setPlante(plante);
        tp.setDatePlantation(datePlantation);
        return terrainPlanteRepository.save(tp);
    }

    public List<TerrainPlanteModel> getCulturesParTerrain(Long terrainId) {
        return terrainPlanteRepository.findByTerrainId(terrainId);
    }
}