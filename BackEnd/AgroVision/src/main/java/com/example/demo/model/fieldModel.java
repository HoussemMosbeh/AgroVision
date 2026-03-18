package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "terrain")
public class fieldModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_terrain", nullable = false)
    private String nom;

    @Column(name = "superficie_hectare", nullable = false, precision = 6, scale = 2)
    private BigDecimal surface;

    @Column(name = "pays", nullable = false)
    private String pays;

    @Column(name = "region", nullable = false)
    private String region;

    @Column(name = "latitude", nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @ManyToOne
    @JoinColumn(name="utilisateur_id", nullable = false)
    private userModel user;

    @Column(name = "date_creation", insertable = false, updatable = false)
    private LocalDateTime dateCreation;

    public fieldModel(){}

    public fieldModel(Long id, String nom, BigDecimal surface, String pays, String region, BigDecimal latitude, BigDecimal longitude, userModel user)
    {
        this.id = id;
        this.nom = nom;
        this.surface = surface;
        this.pays = pays;
        this.region = region;
        this.latitude = latitude;
        this.longitude = longitude;
        this.user = user;
    }

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getNom()
    {
        return nom;
    }

    public void setNom(String nom)
    {
        this.nom = nom;
    }

    public BigDecimal getSurface()
    {
        return surface;
    }

    public void setSurface(BigDecimal surface)
    {
        this.surface = surface;
    }

    public String getPays()
    {
        return pays;
    }

    public void setPays(String pays)
    {
        this.pays = pays;
    }

    public String getRegion()
    {
        return region;
    }

    public void setRegion(String region)
    {
        this.region = region;
    }

    public BigDecimal getLatitude()
    {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude)
    {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude()
    {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude)
    {
        this.longitude = longitude;
    }

    public userModel getUser()
    {
        return user;
    }

    public void setUser(userModel user)
    {
        this.user = user;
    }
    
}