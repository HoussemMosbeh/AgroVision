package com.example.demo.dto;

import java.math.BigDecimal;

public class fieldRequestDTO {

    private String nom;
    private BigDecimal superficie;
    private String pays;
    private String region;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public fieldRequestDTO() {}

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public BigDecimal getSuperficie() { return superficie; }
    public void setSuperficie(BigDecimal superficie) { this.superficie = superficie; }

    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
}