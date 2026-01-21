package com.designpattern.webmotosystem.Entities.documents.builder;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import com.designpattern.webmotosystem.Entities.Commande.Commande;
import com.designpattern.webmotosystem.Entities.documents.adapter.Document;
import com.designpattern.webmotosystem.Entities.documents.adapter.HtmlDocument;

import java.util.ArrayList;
import java.util.List;

public class LiasseHTMLBuilder implements LiasseBuilder {
    private List<Document> documents = new ArrayList<>();

    private final Utilisateur client;
    private final Vehicule vehicule;
    private final Commande commande;

    public LiasseHTMLBuilder(Utilisateur client, Vehicule vehicule, Commande commande) {
        this.client = client;
        this.vehicule = vehicule;
        this.commande = commande;
    }

    @Override
    public void buildDemandeImmatriculation() {
        documents.add(new HtmlDocument("Demande d'immatriculation", client, vehicule, commande));
    }

    @Override
    public void buildCertificatCession() {
        documents.add(new HtmlDocument("Certificat de cession", client, vehicule, commande));
    }

    @Override
    public void buildBonCommande() {
        documents.add(new HtmlDocument("Bon de commande", client, vehicule, commande));
    }

    @Override
    public List<Document> getResult() {
        return documents;
    }
}
