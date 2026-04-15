package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "detection")
public class detectionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "terrain_id")
    private fieldModel terrain;

    @ManyToOne
    @JoinColumn(name = "plante_id")
    private PlanteModel plante;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "predicted_class", nullable = false)
    private String predictedClass;

    @Column(nullable = false)
    private Float confidence;

    @Column(name = "is_healthy", nullable = false)
    private Boolean isHealthy;

    @Column(name = "detected_at")
    private LocalDateTime detectedAt;

    @Column(name = "model_version")
    private String modelVersion;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public fieldModel getTerrain() {
        return terrain;
    }

    public void setTerrain(fieldModel terrain) {
        this.terrain = terrain;
    }

    public PlanteModel getPlante() {
        return plante;
    }

    public void setPlante(PlanteModel plante) {
        this.plante = plante;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getPredictedClass() {
        return predictedClass;
    }

    public void setPredictedClass(String predictedClass) {
        this.predictedClass = predictedClass;
    }

    public Float getConfidence() {
        return confidence;
    }

    public void setConfidence(Float confidence) {
        this.confidence = confidence;
    }

    public Boolean getIsHealthy() {
        return isHealthy;
    }

    public void setIsHealthy(Boolean isHealthy) {
        this.isHealthy = isHealthy;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }
}