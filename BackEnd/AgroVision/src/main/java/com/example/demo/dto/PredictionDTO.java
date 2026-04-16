package com.example.demo.dto;

import java.time.LocalDateTime;

public class PredictionDTO {
    private Long id;
    private Long terrainId;
    private Long planteId;
    private Long solId;
    private Double yieldTons;
    private String quality;
    private Double qualityProbaLow;
    private Double qualityProbaMedium;
    private Double qualityProbaHigh;
    private Double avgTemp;
    private Double totalRain;
    private Double avgHumidity;
    private Double avgRadiation;
    private LocalDateTime predictedAt;
    private Integer year;
    private String modelVersion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTerrainId() { return terrainId; }
    public void setTerrainId(Long terrainId) { this.terrainId = terrainId; }
    public Long getPlanteId() { return planteId; }
    public void setPlanteId(Long planteId) { this.planteId = planteId; }
    public Long getSolId() { return solId; }
    public void setSolId(Long solId) { this.solId = solId; }
    public Double getYieldTons() { return yieldTons; }
    public void setYieldTons(Double yieldTons) { this.yieldTons = yieldTons; }
    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }
    public Double getQualityProbaLow() { return qualityProbaLow; }
    public void setQualityProbaLow(Double qualityProbaLow) { this.qualityProbaLow = qualityProbaLow; }
    public Double getQualityProbaMedium() { return qualityProbaMedium; }
    public void setQualityProbaMedium(Double qualityProbaMedium) { this.qualityProbaMedium = qualityProbaMedium; }
    public Double getQualityProbaHigh() { return qualityProbaHigh; }
    public void setQualityProbaHigh(Double qualityProbaHigh) { this.qualityProbaHigh = qualityProbaHigh; }
    public Double getAvgTemp() { return avgTemp; }
    public void setAvgTemp(Double avgTemp) { this.avgTemp = avgTemp; }
    public Double getTotalRain() { return totalRain; }
    public void setTotalRain(Double totalRain) { this.totalRain = totalRain; }
    public Double getAvgHumidity() { return avgHumidity; }
    public void setAvgHumidity(Double avgHumidity) { this.avgHumidity = avgHumidity; }
    public Double getAvgRadiation() { return avgRadiation; }
    public void setAvgRadiation(Double avgRadiation) { this.avgRadiation = avgRadiation; }
    public LocalDateTime getPredictedAt() { return predictedAt; }
    public void setPredictedAt(LocalDateTime predictedAt) { this.predictedAt = predictedAt; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
}