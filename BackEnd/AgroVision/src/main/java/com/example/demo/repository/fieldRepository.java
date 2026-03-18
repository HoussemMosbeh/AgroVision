package com.example.demo.repository;

import com.example.demo.model.fieldModel;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface fieldRepository extends JpaRepository<fieldModel,Long> 
{
    //find by id and user id
    Optional<fieldModel> findByIdAndUserId(Long id, Long userId);

    //find by id
    Optional<fieldModel> findById(Long id);

    //find all by user id
    List<fieldModel> findByUserId(Long userId);
}
