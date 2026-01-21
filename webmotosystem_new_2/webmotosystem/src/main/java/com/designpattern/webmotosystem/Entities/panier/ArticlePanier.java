// src/main/java/com/designpattern/webmotosystem/Entities/panier/ArticlePanier.java
package com.designpattern.webmotosystem.Entities.panier;

import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ArticlePanier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Panier panier;

    @ManyToOne(optional = false)
    private Vehicule vehicule;

    private int quantite = 1;

    private double prixFinal;

    private String image;

    @OneToMany(mappedBy = "articlePanier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OptionChoisie> options = new ArrayList<>();

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public Panier getPanier() { return panier; }
    public void setPanier(Panier panier) { this.panier = panier; }
    public Vehicule getVehicule() { return vehicule; }
    public void setVehicule(Vehicule vehicule) { this.vehicule = vehicule; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    public List<OptionChoisie> getOptions() { return options; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public void recalculerPrix() {
        double base = vehicule.getPrixBase();
        double optionsTotal = options.stream().mapToDouble(OptionChoisie::getPrix).sum();
        this.prixFinal = (base + optionsTotal) * quantite;
    }

    public double getPrixFinal() {
        if (prixFinal == 0) recalculerPrix();
        return prixFinal;
    }

    public double getMontantTotal() {
        return getPrixFinal();
    }
}
