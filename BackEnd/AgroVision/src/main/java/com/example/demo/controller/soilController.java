package com.example.demo.controller;

import com.example.demo.dto.soilRequestDTO;
import com.example.demo.service.soilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fields/{fieldId}/soils")
public class soilController 
{
    private final soilService soilService;

    public soilController(soilService soilService) {
        this.soilService = soilService;
    }

    @PostMapping
    public ResponseEntity<soilRequestDTO.Response> addMetrics(
        @PathVariable Long fieldId,
        @RequestBody soilRequestDTO.Request request)
    {
        return ResponseEntity.ok(soilService.addMetrique(fieldId, request));
    }

    @GetMapping
    public ResponseEntity<List<soilRequestDTO.Response>> getMetrics(
        @PathVariable Long fieldId
    )
    {
        return ResponseEntity.ok(soilService.getMetriques(fieldId));
    }
}
