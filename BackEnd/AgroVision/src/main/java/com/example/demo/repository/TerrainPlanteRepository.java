package com.example.demo.repository;

import com.example.demo.model.TerrainPlanteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TerrainPlanteRepository extends JpaRepository<TerrainPlanteModel, Long> {
    List<TerrainPlanteModel> findByTerrainId(Long terrainId);
}