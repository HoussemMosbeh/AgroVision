package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.demo.dto.fieldRequestDTO;
import com.example.demo.model.fieldModel;
import com.example.demo.model.userModel;
import com.example.demo.repository.userRepository;
import com.example.demo.service.fieldService;

@RestController
@RequestMapping("/api/fields")
public class fieldController 
{

    @Autowired
    private fieldService fieldService;

    @Autowired
    private userRepository userRepository;

    @GetMapping
    public ResponseEntity<List<fieldModel>> getUserFields() {
        userModel user = getAuthenticatedUser();
        return ResponseEntity.ok(fieldService.getFieldsByUser(user.getId()));
    }

    @GetMapping("/{fieldId}")
    public ResponseEntity<fieldModel> getField(@PathVariable Long fieldId) {
        userModel user = getAuthenticatedUser();
        return ResponseEntity.ok(fieldService.getFieldById(fieldId, user.getId()));
    }

    @PostMapping
    public ResponseEntity<fieldModel> createField(@RequestBody fieldRequestDTO request) {
        userModel user = getAuthenticatedUser();
        fieldModel created = fieldService.createField(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{fieldId}")
    public ResponseEntity<fieldModel> updateField(
        @PathVariable Long fieldId,
        @RequestBody fieldRequestDTO request
    ) {
        userModel user = getAuthenticatedUser();
        fieldModel updated = fieldService.updateField(fieldId, user.getId(), request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{fieldId}")
    public ResponseEntity<Void> deleteField(@PathVariable Long fieldId) {
        userModel user = getAuthenticatedUser();
        fieldService.deleteField(fieldId, user.getId());
        return ResponseEntity.noContent().build();
    }

    private userModel getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

