// src/main/java/com/designpattern/webmotosystem/panier/command/RetirerOptionCommand.java
package com.designpattern.webmotosystem.Entities.panier.command;

import com.designpattern.webmotosystem.Entities.panier.ArticlePanier;
import com.designpattern.webmotosystem.Entities.panier.OptionChoisie;

public class RetirerOptionCommand implements PanierCommand {
    private final ArticlePanier article;
    private final OptionChoisie optionChoisie;

    public RetirerOptionCommand(ArticlePanier article, OptionChoisie optionChoisie) {
        this.article = article;
        this.optionChoisie = optionChoisie;
    }

    @Override public void execute() { article.getOptions().remove(optionChoisie); }
    @Override public void undo() { article.getOptions().add(optionChoisie); }
}
