package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Commande.*;
import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import com.designpattern.webmotosystem.Entities.panier.ArticlePanier;
import com.designpattern.webmotosystem.Entities.panier.OptionChoisie;
import com.designpattern.webmotosystem.Repositories.CommandeRepository;
import com.designpattern.webmotosystem.Repositories.ArticlePanierRepository;
import com.designpattern.webmotosystem.factory.CommandeFactoryService;
import com.designpattern.webmotosystem.Services.taxe.TaxeStrategyFactory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CommandeService {
    private final CommandeRepository commandeRepository;
    private final CommandeFactoryService commandeFactoryService;
    private final TaxeStrategyFactory taxeStrategyFactory;
    private final UtilisateurService utilisateurService;
    private final VehiculeService vehiculeService;
    private final ArticlePanierRepository articlePanierRepository;

    public List<Commande> getCommandesByClientId(int clientId) {
        return commandeRepository.findByClientId(clientId);
    }

    /**
     * Créer une commande avec client, vendeur et véhicule (flux direct)
     */
    public Commande creerCommande(EnumCommande type, int clientId, int vendeurId, Long vehiculeId, String paysLivraison) {
        Utilisateur client = utilisateurService.getUserById(clientId);
        Utilisateur vendeur = utilisateurService.getUserById(vendeurId);
        Vehicule vehicule = vehiculeService.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));

        double montantBase = vehicule.getPrixBase();
        Commande commande = commandeFactoryService.createCommande(type, montantBase, paysLivraison);
        commande.setClient(client);
        commande.setVendeur(vendeur);
        commande.setVehicule(vehicule);

        double taxe = taxeStrategyFactory.getStrategy(paysLivraison).calculerTaxe(montantBase);
        double total = commande.calculerTotal(taxe);
        commande.setMontant(total);

        return commandeRepository.save(commande);
    }

    /**
     * ✅ NOUVELLE VERSION : Créer une commande depuis un article du panier AVEC options
     */
    public Commande creerCommandeDepuisPanier(EnumCommande type, int clientId, int vendeurId, 
                                              Long cartItemId, String paysLivraison) {
        Utilisateur client = utilisateurService.getUserById(clientId);
        Utilisateur vendeur = utilisateurService.getUserById(vendeurId);
        
        ArticlePanier article = articlePanierRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Article introuvable dans le panier"));

        // Recalculer le prix avec les options
        article.recalculerPrix();
        double montantBase = article.getPrixFinal();

        Commande commande = commandeFactoryService.createCommande(type, montantBase, paysLivraison);
        commande.setClient(client);
        commande.setVendeur(vendeur);
        commande.setVehicule(article.getVehicule());

        // ✅ COPIER LES OPTIONS DU PANIER VERS LA COMMANDE
        for (OptionChoisie optionChoisie : article.getOptions()) {
            commande.ajouterOption(
                optionChoisie.getCode(),
                optionChoisie.getOption().getNom(),
                optionChoisie.getPrix()
            );
        }

        double taxe = taxeStrategyFactory.getStrategy(paysLivraison).calculerTaxe(montantBase);
        double total = commande.calculerTotal(taxe);
        commande.setMontant(total);

        return commandeRepository.save(commande);
    }

    public Optional<Commande> getCommandeById(Long id) {
        return commandeRepository.findById(id);
    }

    public void changerEtat(Long id, EtatCommande nouvelEtat) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));
        commande.changerEtatCommande(nouvelEtat);
        commandeRepository.save(commande);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }
}