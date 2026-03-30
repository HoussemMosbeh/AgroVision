package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "plante")
public class PlanteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_plante", nullable = false)
    private String nomPlante;

    @Column(name = "type_plante", nullable = false)
    private String typePlante;

    @Column(name = "description")
    private String description;

    public PlanteModel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomPlante() { return nomPlante; }
    public void setNomPlante(String nomPlante) { this.nomPlante = nomPlante; }
    public String getTypePlante() { return typePlante; }
    public void setTypePlante(String typePlante) { this.typePlante = typePlante; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}