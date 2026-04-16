package com.example.demo.controller;

import com.example.demo.dto.PredictionDTO;
import com.example.demo.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/terrain/{terrainId}")
    public ResponseEntity<PredictionDTO> predict(@PathVariable Long terrainId) {
        return ResponseEntity.ok(predictionService.predict(terrainId));
    }

    @GetMapping("/terrain/{terrainId}")
    public ResponseEntity<List<PredictionDTO>> getByTerrain(@PathVariable Long terrainId) {
        return ResponseEntity.ok(predictionService.getByTerrain(terrainId));
    }

    @GetMapping
    public ResponseEntity<List<PredictionDTO>> getAll() {
        return ResponseEntity.ok(predictionService.getAll());
    }
}