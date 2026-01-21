package com.designpattern.webmotosystem.Entities.documents.bridge;

public class FormulaireClient extends Formulaire {
    public FormulaireClient(FormsRenderer renderer) {
        super(renderer);
    }

    @Override
    public void generer() {
        renderer.drawText("Nom du client");
        renderer.drawInput("clientName");
    }
}
