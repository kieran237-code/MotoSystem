package com.designpattern.webmotosystem.Entities.documents.bridge;

public abstract class Formulaire {
    protected FormsRenderer renderer;

    public Formulaire(FormsRenderer renderer) {
        this.renderer = renderer;
    }

    public abstract void generer();
}
