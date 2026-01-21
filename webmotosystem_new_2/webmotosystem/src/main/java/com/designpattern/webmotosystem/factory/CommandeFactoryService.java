package com.designpattern.webmotosystem.factory;

import com.designpattern.webmotosystem.Entities.Commande.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CommandeFactoryService {

    public Commande createCommande(EnumCommande type,
                                   double montantBase,
                                   String paysLivraison) {
        Commande commande;
        switch (type) {
            case COMPTANT -> commande = new CommandeComptant();
            case CREDIT -> commande = new CommandeCredit();
            default -> throw new IllegalArgumentException("Type de commande inconnu");
        }
        commande.setMontant(montantBase);
        commande.setPaysLivraison(paysLivraison);
        commande.setNumCommande(UUID.randomUUID().toString());
        return commande;
    }
}
