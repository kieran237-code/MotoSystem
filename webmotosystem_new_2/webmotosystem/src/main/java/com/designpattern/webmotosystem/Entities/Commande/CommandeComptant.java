package com.designpattern.webmotosystem.Entities.Commande;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("COMPTANT")
public class CommandeComptant extends Commande {

    @Override
    public double calculerFraisSpecifique() {
        // Pas de frais supplémentaires pour une commande comptant
        return 0.0;
    }
}
