package com.example.demo.repository;

import com.example.demo.model.TerrainPlanteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TerrainPlanteRepository extends JpaRepository<TerrainPlanteModel, Long> {
    List<TerrainPlanteModel> findByTerrainId(Long terrainId);
}