package com.designpattern.webmotosystem.Entities.documents.bridge;

public class FormulaireCommande extends Formulaire {
    public FormulaireCommande(FormsRenderer renderer) {
        super(renderer);
    }

    @Override
    public void generer() {
        renderer.drawText("Commande");
        renderer.drawInput("orderNumber");
    }
}
