// src/main/java/com/designpattern/webmotosystem/panier/command/RetirerArticleCommand.java
package com.designpattern.webmotosystem.Entities.panier.command;

import com.designpattern.webmotosystem.Entities.panier.ArticlePanier;
import com.designpattern.webmotosystem.Entities.panier.Panier;

public class RetirerArticleCommand implements PanierCommand {
    private final Panier panier;
    private final ArticlePanier article;

    public RetirerArticleCommand(Panier panier, ArticlePanier article) {
        this.panier = panier;
        this.article = article;
    }

    @Override public void execute() { panier.getArticles().remove(article); }
    @Override public void undo() { panier.getArticles().add(article); }
}
