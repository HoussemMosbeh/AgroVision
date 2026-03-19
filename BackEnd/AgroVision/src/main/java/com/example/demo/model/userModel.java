package com.example.demo.model;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
@Table(name = "utilisateurs")
public class userModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nom;

	@Column(nullable = false)
	private String prenom;

	@Column(nullable = false)
	private String email;

	@JsonIgnore
	@Column(name = "mot_de_passe" ,nullable = false)
	private String password;

	@Column(name = "date_creation", insertable = false, updatable = false)
	private LocalDateTime dateCreation;

	// no-arg constructor required by JPA
	public userModel() {}

	// all-args constructor for convenience
	public userModel(Long id, String nom, String prenom, String email, String password) {
		this.id = id;
		this.nom = nom;
		this.prenom = prenom;
		this.email = email;
		this.password = password;
	}

	// getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}