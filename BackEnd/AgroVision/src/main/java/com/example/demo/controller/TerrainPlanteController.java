package com.example.demo.controller;

import com.example.demo.model.TerrainPlanteModel;
import com.example.demo.service.TerrainPlanteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/fields/{fieldId}/plantes")
public class TerrainPlanteController {

    private final TerrainPlanteService terrainPlanteService;

    public TerrainPlanteController(TerrainPlanteService terrainPlanteService) {
        this.terrainPlanteService = terrainPlanteService;
    }

    @PostMapping
    public ResponseEntity<TerrainPlanteModel> planter(
            @PathVariable Long fieldId,
            @RequestParam Long planteId,
            @RequestParam String datePlantation) {
        return ResponseEntity.ok(terrainPlanteService.planterCulture(
                fieldId, planteId, LocalDate.parse(datePlantation)));
    }

    @GetMapping
    public ResponseEntity<List<TerrainPlanteModel>> getCultures(
            @PathVariable Long fieldId) {
        return ResponseEntity.ok(terrainPlanteService.getCulturesParTerrain(fieldId));
    }
}