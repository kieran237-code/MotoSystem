// src/main/java/com/designpattern/webmotosystem/Entities/panier/Panier.java
package com.designpattern.webmotosystem.Entities.panier;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Panier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Utilisateur utilisateur;

    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticlePanier> articles = new ArrayList<>();

    private LocalDateTime dateCreation = LocalDateTime.now();

    public Long getId() { return id; }
    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
    public List<ArticlePanier> getArticles() { return articles; }
    public LocalDateTime getDateCreation() { return dateCreation; }

    public double getMontantTotal() {
        return articles.stream().mapToDouble(ArticlePanier::getMontantTotal).sum();
    }
}
