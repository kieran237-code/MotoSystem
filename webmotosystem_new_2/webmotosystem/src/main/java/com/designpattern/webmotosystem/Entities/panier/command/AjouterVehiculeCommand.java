// src/main/java/com/designpattern/webmotosystem/panier/command/AjouterVehiculeCommand.java
package com.designpattern.webmotosystem.Entities.panier.command;

import com.designpattern.webmotosystem.Entities.panier.ArticlePanier;
import com.designpattern.webmotosystem.Entities.panier.Panier;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;

public class AjouterVehiculeCommand implements PanierCommand {
    private final Panier panier;
    private final ArticlePanier article;

    public AjouterVehiculeCommand(Panier panier, Vehicule vehicule) {
        this.panier = panier;
        this.article = new ArticlePanier();
        this.article.setPanier(panier);
        this.article.setVehicule(vehicule);
        this.article.setQuantite(1);
    }

    @Override public void execute() { panier.getArticles().add(article); }
    @Override public void undo() { panier.getArticles().remove(article); }
    public ArticlePanier getArticle() { return article; }
}
