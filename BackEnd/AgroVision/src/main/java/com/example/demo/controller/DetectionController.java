package com.example.demo.controller;

import com.example.demo.dto.DetectionDTO;
import com.example.demo.service.DetectionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/detections")
public class DetectionController {

    private final DetectionService detectionService;

    public DetectionController(DetectionService detectionService) {
        this.detectionService = detectionService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DetectionDTO> detect(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "terrainId", required = false) Long terrainId,
        @RequestParam(value = "planteId", required = false) Long planteId
    ) throws IOException {
        DetectionDTO result = detectionService.detect(file, terrainId, planteId);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<DetectionDTO>> getAll() {
        return ResponseEntity.ok(detectionService.getAll());
    }

    @GetMapping("/terrain/{terrainId}")
    public ResponseEntity<List<DetectionDTO>> getByTerrain(@PathVariable Long terrainId) {
        return ResponseEntity.ok(detectionService.getByTerrainId(terrainId));
    }
}