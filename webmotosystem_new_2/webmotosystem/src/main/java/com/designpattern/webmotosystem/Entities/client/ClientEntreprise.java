package com.designpattern.webmotosystem.Entities.client;

/**
 * Interface commune pour representer une entreprise cliente.
 * Role "Component" dans le pattern Composite.
 */
public interface ClientEntreprise {
    String getNom();
    int getTailleFlotte();
    void decrire();
}
