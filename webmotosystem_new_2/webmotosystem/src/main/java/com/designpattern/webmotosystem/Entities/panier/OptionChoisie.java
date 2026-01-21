// src/main/java/com/designpattern/webmotosystem/Entities/panier/OptionChoisie.java
package com.designpattern.webmotosystem.Entities.panier;

import jakarta.persistence.*;

@Entity
public class OptionChoisie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private ArticlePanier articlePanier;

    @ManyToOne(optional = false)
    private OptionProduit option;

    public Long getId() { return id; }
    public ArticlePanier getArticlePanier() { return articlePanier; }
    public void setArticlePanier(ArticlePanier articlePanier) { this.articlePanier = articlePanier; }
    public OptionProduit getOption() { return option; }
    public void setOption(OptionProduit option) { this.option = option; }

    public double getPrix() { return option.getPrix(); }
    public String getCode() { return option.getCode(); }
}
