package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "terrain_plante")
public class TerrainPlanteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "terrain_id", nullable = false)
    private fieldModel terrain;

    @ManyToOne
    @JoinColumn(name = "plante_id", nullable = false)
    private PlanteModel plante;

    @Column(name = "date_plantation", nullable = false)
    private LocalDate datePlantation;

    @Column(name = "date_recolte")
    private LocalDate dateRecolte;

    public TerrainPlanteModel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public fieldModel getTerrain() { return terrain; }
    public void setTerrain(fieldModel terrain) { this.terrain = terrain; }
    public PlanteModel getPlante() { return plante; }
    public void setPlante(PlanteModel plante) { this.plante = plante; }
    public LocalDate getDatePlantation() { return datePlantation; }
    public void setDatePlantation(LocalDate datePlantation) { this.datePlantation = datePlantation; }
    public LocalDate getDateRecolte() { return dateRecolte; }
    public void setDateRecolte(LocalDate dateRecolte) { this.dateRecolte = dateRecolte; }
}