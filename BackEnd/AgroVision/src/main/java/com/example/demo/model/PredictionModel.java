package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prediction")
public class PredictionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "terrain_id")
    private fieldModel terrain;

    @ManyToOne
    @JoinColumn(name = "plante_id")
    private PlanteModel plante;

    @ManyToOne
    @JoinColumn(name = "sol_id")
    private soilModel sol;

    @Column(name = "yield_tons_per_hectare")
    private Double yieldTons;

    @Column(name = "quality")
    private String quality;

    @Column(name = "quality_proba_low")
    private Double qualityProbaLow;

    @Column(name = "quality_proba_medium")
    private Double qualityProbaMedium;

    @Column(name = "quality_proba_high")
    private Double qualityProbaHigh;

    @Column(name = "avg_temp")
    private Double avgTemp;

    @Column(name = "total_rain")
    private Double totalRain;

    @Column(name = "avg_humidity")
    private Double avgHumidity;

    @Column(name = "avg_radiation")
    private Double avgRadiation;

    @Column(name = "predicted_at", insertable = false, updatable = false)
    private LocalDateTime predictedAt;

    @Column(name = "year")
    private Integer year;

    @Column(name = "model_version")
    private String modelVersion;

    public PredictionModel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public fieldModel getTerrain() { return terrain; }
    public void setTerrain(fieldModel terrain) { this.terrain = terrain; }
    public PlanteModel getPlante() { return plante; }
    public void setPlante(PlanteModel plante) { this.plante = plante; }
    public soilModel getSol() { return sol; }
    public void setSol(soilModel sol) { this.sol = sol; }
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