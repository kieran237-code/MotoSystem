package com.designpattern.webmotosystem.Entities.client;

import com.designpattern.webmotosystem.Entities.Utilisateur;

/**
 * Classe representant une filiale.
 * Role "Leaf" dans le pattern Composite.
 */
public class Filiale implements ClientEntreprise {
    private final Utilisateur filiale;

    public Filiale(Utilisateur filiale) {
        this.filiale = filiale;
    }

    @Override
    public String getNom() {
        return filiale.getNom();
    }

    @Override
    public int getTailleFlotte() {
        // Exemple simplifié : chaque filiale a une flotte fixe.
        // Tu peux remplacer par un champ dans Utilisateur si besoin.
        return 10;
    }

    @Override
    public void decrire() {
        System.out.println("Filiale: " + getNom() + " avec flotte de " + getTailleFlotte() + " vehicules");
    }
}
