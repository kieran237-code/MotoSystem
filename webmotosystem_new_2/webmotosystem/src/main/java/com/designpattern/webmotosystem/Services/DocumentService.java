package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import com.designpattern.webmotosystem.Entities.Commande.Commande;
import com.designpattern.webmotosystem.Entities.documents.adapter.Document;
import com.designpattern.webmotosystem.Entities.documents.builder.*;
import com.designpattern.webmotosystem.Entities.documents.singleton.LiasseDocuments;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final UtilisateurService utilisateurService;
    private final VehiculeService vehiculeService;
    private final CommandeService commandeService;

    public DocumentService(UtilisateurService utilisateurService,
                           VehiculeService vehiculeService,
                           CommandeService commandeService) {
        this.utilisateurService = utilisateurService;
        this.vehiculeService = vehiculeService;
        this.commandeService = commandeService;
    }

    // Générer une liasse PDF
    public List<Document> generatePDFDocuments(int clientId, Long vehiculeId, Long commandeId) {
        LiasseBuilder builder = new LiassePDFBuilder(
                getClient(clientId),
                getVehicule(vehiculeId),
                getCommande(commandeId)
        );
        LiasseDirector director = new LiasseDirector(builder);
        List<Document> documents = director.construct();

        LiasseDocuments.getInstance().getDocuments().addAll(documents);
        documents.forEach(Document::print);

        return documents;
    }

    // Générer une liasse HTML
    public List<Document> generateHTMLDocuments(int clientId, Long vehiculeId, Long commandeId) {
        LiasseBuilder builder = new LiasseHTMLBuilder(
                getClient(clientId),
                getVehicule(vehiculeId),
                getCommande(commandeId)
        );
        LiasseDirector director = new LiasseDirector(builder);
        List<Document> documents = director.construct();

        LiasseDocuments.getInstance().getDocuments().addAll(documents);
        documents.forEach(Document::print);

        return documents;
    }

    public Utilisateur getClient(int clientId) {
        return utilisateurService.getUserById(clientId);
    }

    public Vehicule getVehicule(Long vehiculeId) {
        return vehiculeService.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));
    }

    public Commande getCommande(Long commandeId) {
        return commandeService.getCommandeById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));
    }
}
