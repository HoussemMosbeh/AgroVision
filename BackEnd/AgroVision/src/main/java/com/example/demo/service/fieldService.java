package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.dto.fieldRequestDTO;
import com.example.demo.repository.fieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class fieldService {

    @Autowired
    private fieldRepository fieldRepository;

    public List<fieldModel> getFieldsByUser(Long userId) {
        return fieldRepository.findByUserId(userId);
    }

    public fieldModel getFieldById(Long fieldId, Long userId) {
        return fieldRepository.findByIdAndUserId(fieldId, userId)
            .orElseThrow(() -> new RuntimeException("Field not found"));
    }

    public fieldModel createField(fieldRequestDTO request, userModel user) {
        fieldModel field = new fieldModel();
        field.setNom(request.getNom());
        field.setSurface(request.getSuperficie());
        field.setPays(request.getPays());
        field.setRegion(request.getRegion());
        field.setLatitude(request.getLatitude());
        field.setLongitude(request.getLongitude());
        field.setUser(user);
        return fieldRepository.save(field);
    }

    public fieldModel updateField(Long fieldId, Long userId, fieldRequestDTO request) {
        fieldModel field = fieldRepository.findByIdAndUserId(fieldId, userId)
            .orElseThrow(() -> new RuntimeException("Field not found"));
        field.setNom(request.getNom());
        field.setSurface(request.getSuperficie());
        field.setPays(request.getPays());
        field.setRegion(request.getRegion());
        field.setLatitude(request.getLatitude());
        field.setLongitude(request.getLongitude());
        return fieldRepository.save(field);
    }

    public void deleteField(Long fieldId, Long userId) {
        fieldModel field = fieldRepository.findByIdAndUserId(fieldId, userId)
            .orElseThrow(() -> new RuntimeException("Field not found"));
        fieldRepository.delete(field);
    }
}
