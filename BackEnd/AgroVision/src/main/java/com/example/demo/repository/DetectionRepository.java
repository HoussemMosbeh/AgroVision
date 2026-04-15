package com.example.demo.repository;

import com.example.demo.model.detectionModel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetectionRepository extends JpaRepository<detectionModel, Long> {
    List<detectionModel> findByTerrainId(Long terrainId);
    List<detectionModel> findByPlanteId(Long planteId);
}