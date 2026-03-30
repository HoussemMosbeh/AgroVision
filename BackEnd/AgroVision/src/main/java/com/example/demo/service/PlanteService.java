package com.example.demo.service;

import com.example.demo.model.PlanteModel;
import com.example.demo.repository.PlanteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlanteService {

    private final PlanteRepository planteRepository;

    public PlanteService(PlanteRepository planteRepository) {
        this.planteRepository = planteRepository;
    }

    public List<PlanteModel> getAllPlantes() {
        return planteRepository.findAll();
    }
}