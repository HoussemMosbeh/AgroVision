package com.example.demo.repository;

import com.example.demo.model.PlanteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanteRepository extends JpaRepository<PlanteModel, Long> {}