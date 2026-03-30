package com.example.demo.repository;

import com.example.demo.model.soilModel;    
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface soilRepository extends JpaRepository<soilModel,Long>
{
    //find by feild id
    List<soilModel> findByFieldId(Long fieldId);
}
