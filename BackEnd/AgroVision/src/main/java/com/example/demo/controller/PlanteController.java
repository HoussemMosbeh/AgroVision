package com.example.demo.controller;

import com.example.demo.model.PlanteModel;
import com.example.demo.service.PlanteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plantes")
public class PlanteController {

    private final PlanteService planteService;

    public PlanteController(PlanteService planteService) {
        this.planteService = planteService;
    }

    @GetMapping
    public ResponseEntity<List<PlanteModel>> getAllPlantes() {
        return ResponseEntity.ok(planteService.getAllPlantes());
    }
}