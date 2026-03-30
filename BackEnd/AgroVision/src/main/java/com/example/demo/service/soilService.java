package com.example.demo.service;

import com.example.demo.model.soilModel;
import com.example.demo.model.fieldModel;
import com.example.demo.repository.soilRepository;
import com.example.demo.repository.fieldRepository;
import com.example.demo.dto.soilRequestDTO;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class soilService 
{
    private final soilRepository soilRepository;
    private final fieldRepository fieldRepository;

    public soilService(soilRepository soilRepository, fieldRepository fieldRepository)
    {
        this.soilRepository = soilRepository;
        this.fieldRepository = fieldRepository;
    }

    public soilRequestDTO.Response addMetrique(Long terrainId, soilRequestDTO.Request request)
    {
        fieldModel field = fieldRepository.findById(terrainId)
            .orElseThrow(() -> new RuntimeException("terrain non trouve"));

        soilModel soil = new soilModel();
        soil.setField(field);
        soil.setPh(request.getPh());
        soil.setAzote(request.getAzote());
        soil.setPhosphore(request.getPhosphore());
        soil.setPotassium(request.getPotassium());
        soil.setHumidite(request.getHumidite());
        soil.setMatiere_organique(request.getMatiereOrganique());
        soil.setTemperature(request.getTemperature());

        soilModel saved = soilRepository.save(soil);
        return toResponse(saved);
    }

    public List<soilRequestDTO.Response> getMetriques(Long terrainId) {
        return soilRepository.findByFieldId(terrainId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private soilRequestDTO.Response toResponse(soilModel soil) {
        soilRequestDTO.Response response = new soilRequestDTO.Response();
        response.setId(soil.getId());
        response.setTerrainid(soil.getField().getId());
        response.setPh(soil.getPh());
        response.setAzote(soil.getAzote());
        response.setPhosphore(soil.getPhosphore());
        response.setPotassium(soil.getPotassium());
        response.setHumidite(soil.getHumidite());
        response.setMatiereOrganique(soil.getMatiere_organique());
        response.setTemperature(soil.getTemperature());
        response.setDateMesure(soil.getDateMesure());
        return response;
    }
}
