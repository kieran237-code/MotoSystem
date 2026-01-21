package com.designpattern.webmotosystem.Entities.Commande;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CREDIT")
public class CommandeCredit extends Commande {

    @Override
    public double calculerFraisSpecifique() {
        // Exemple : frais de crédit = 10% du montant
        return getMontant() * 0.10;
    }
}
