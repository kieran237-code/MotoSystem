// src/main/java/com/designpattern/webmotosystem/Entities/panier/OptionProduit.java
package com.designpattern.webmotosystem.Entities.panier;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class OptionProduit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) private String code; // ex: SIEGES_CUIR
    @Column(nullable = false) private String nom;                 // ex: Sièges en cuir
    @Column(nullable = false) private double prix;

    @ElementCollection
    @CollectionTable(name = "option_produit_incompatibles", joinColumns = @JoinColumn(name = "option_produit_id"))
    @Column(name = "incompatibles")
    private Set<String> incompatibles = new HashSet<>();

    public Long getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }
    public Set<String> getIncompatibles() { return incompatibles; }
}
