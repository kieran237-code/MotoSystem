package com.designpattern.webmotosystem.Entities.client;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import java.util.ArrayList;
import java.util.List;

/**
 * Classe representant une societe mere.
 * Role "Composite" dans le pattern Composite.
 */
public class Societe implements ClientEntreprise {
    private final Utilisateur societe;
    private final List<ClientEntreprise> enfants = new ArrayList<>();

    public Societe(Utilisateur societe) {
        this.societe = societe;
    }

    public void ajouter(ClientEntreprise enfant) {
        enfants.add(enfant);
    }

    public void retirer(ClientEntreprise enfant) {
        enfants.remove(enfant);
    }

    @Override
    public String getNom() {
        return societe.getNom();
    }

    @Override
    public int getTailleFlotte() {
        return enfants.stream().mapToInt(ClientEntreprise::getTailleFlotte).sum();
    }

    @Override
    public void decrire() {
        System.out.println("Societe: " + getNom() + " flotte totale=" + getTailleFlotte());
        for (ClientEntreprise enfant : enfants) {
            enfant.decrire();
        }
    }
}
