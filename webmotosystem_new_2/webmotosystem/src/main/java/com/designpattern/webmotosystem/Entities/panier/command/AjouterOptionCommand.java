// src/main/java/com/designpattern/webmotosystem/panier/command/AjouterOptionCommand.java
package com.designpattern.webmotosystem.Entities.panier.command;

import com.designpattern.webmotosystem.Entities.panier.ArticlePanier;
import com.designpattern.webmotosystem.Entities.panier.OptionChoisie;
import com.designpattern.webmotosystem.Entities.panier.OptionProduit;

public class AjouterOptionCommand implements PanierCommand {
    private final ArticlePanier article;
    private final OptionChoisie optionChoisie;

    public AjouterOptionCommand(ArticlePanier article, OptionProduit option) {
        this.article = article;
        this.optionChoisie = new OptionChoisie();
        this.optionChoisie.setArticlePanier(article);
        this.optionChoisie.setOption(option);
    }

    @Override public void execute() { article.getOptions().add(optionChoisie); }
    @Override public void undo() { article.getOptions().remove(optionChoisie); }
    public OptionChoisie getOptionChoisie() { return optionChoisie; }
}
