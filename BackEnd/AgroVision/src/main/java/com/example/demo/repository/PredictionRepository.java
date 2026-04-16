package com.example.demo.repository;

import com.example.demo.model.PredictionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PredictionRepository extends JpaRepository<PredictionModel, Long> {
    List<PredictionModel> findByTerrainId(Long terrainId);
}