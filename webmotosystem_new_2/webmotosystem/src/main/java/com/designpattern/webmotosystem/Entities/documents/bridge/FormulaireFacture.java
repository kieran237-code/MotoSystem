package com.designpattern.webmotosystem.Entities.documents.bridge;

public class FormulaireFacture extends Formulaire {
    public FormulaireFacture(FormsRenderer renderer) {
        super(renderer);
    }

    @Override
    public void generer() {
        renderer.drawText("Facture");
        renderer.drawInput("invoiceNumber");
    }
}
