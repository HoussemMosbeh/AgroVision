package com.example.demo.dto;

import java.util.Map;

public class DetectionResponseDTO {
    private String disease;
    private Float confidence;
    private Map<String, Float> top5;

    // Getters and Setters
    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public Float getConfidence() {
        return confidence;
    }

    public void setConfidence(Float confidence) {
        this.confidence = confidence;
    }

    public Map<String, Float> getTop5() {
        return top5;
    }

    public void setTop5(Map<String, Float> top5) {
        this.top5 = top5;
    }

    // Helper method to determine if healthy based on disease name
    public boolean isHealthy() {
        if (disease == null) return false;
        return disease.toLowerCase().contains("healthy");
    }
    
    @Override
    public String toString() {
    return "DetectionResponseDTO{disease='" + disease + "', confidence=" + confidence + "}";
    }
}