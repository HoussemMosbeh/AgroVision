package com.example.demo.model;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name="terre_metrique")
public class soilModel 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "terrain_id", nullable = false)
    private fieldModel field;

    @Column(name = "ph")
    private BigDecimal ph;

    @Column(name= "azote_ppm")
    private BigDecimal azote;

    @Column(name = "phosphore_ppm")
    private BigDecimal phosphore;

    @Column(name = "potassium_ppm")
    private BigDecimal potassium;

    @Column(name = "humidite_percent")
    private BigDecimal humidite;

    @Column(name = "matiere_organique_percent")
    private BigDecimal matiere_organique;

    @Column(name = "temperature_celsius")
    private BigDecimal temperature;

    @Column(name = "date_mesure", insertable = false, updatable = false)
    private LocalDateTime dateMesure;

    public soilModel(){}

    public soilModel(Long id, fieldModel field, BigDecimal ph, BigDecimal azote, BigDecimal phosphore, BigDecimal potassium, BigDecimal humidite, BigDecimal matiere_organique, BigDecimal temperature)
    {
        this.id = id;
        this.field = field;
        this.ph = ph;
        this.azote = azote;
        this.phosphore = phosphore;
        this.potassium = potassium;
        this.humidite = humidite;
        this.matiere_organique = matiere_organique;
        this.temperature = temperature;
    }

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public fieldModel getField()
    {
        return field;
    }

    public void setField(fieldModel field)
    {
        this.field = field;
    }

    public BigDecimal getPh()
    {
        return ph;
    }

    public void setPh(BigDecimal ph)
    {
        this.ph = ph;
    }

    public BigDecimal getAzote()
    {
        return azote;
    }

    public void setAzote(BigDecimal azote)
    {
        this.azote = azote;
    }

    public BigDecimal getPhosphore()
    {
        return phosphore;
    }

    public void setPhosphore(BigDecimal phosphore)
    {
        this.phosphore = phosphore;
    }

    public BigDecimal getPotassium()
    {
        return potassium;
    }

    public void setPotassium(BigDecimal potassium)
    {
        this.potassium = potassium;
    }

    public BigDecimal getHumidite()
    {
        return humidite;
    }

    public void setHumidite(BigDecimal humidite)
    {
        this.humidite = humidite;
    }

    public BigDecimal getMatiere_organique()
    {
        return matiere_organique;
    }

    public void setMatiere_organique(BigDecimal matiere_organique)
    {
        this.matiere_organique = matiere_organique;
    }

    public BigDecimal getTemperature()
    {
        return temperature;
    }

    public void setTemperature(BigDecimal temperature)
    {
        this.temperature = temperature;
    }

    public LocalDateTime getDateMesure()
    {
        return dateMesure;
    }
    
    public void setDateMesure(LocalDateTime dateMesure)
    {
        this.dateMesure = dateMesure;
    }
}
