// src/main/java/com/designpattern/webmotosystem/Services/PanierService.java
package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import com.designpattern.webmotosystem.Entities.panier.*;
import com.designpattern.webmotosystem.Repositories.*;
import com.designpattern.webmotosystem.Entities.panier.command.*;
import com.designpattern.webmotosystem.Entities.panier.memento.PanierCaretaker;
import com.designpattern.webmotosystem.Entities.panier.memento.PanierMemento;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PanierService {

    private final PanierRepository panierRepository;
    private final ArticlePanierRepository articlePanierRepository;
    private final OptionProduitRepository optionProduitRepository;
    private final OptionChoisieRepository optionChoisieRepository;
    private final UtilisateurService utilisateurService;
    private final VehiculeService vehiculeService;

    private final PanierCaretaker caretaker = new PanierCaretaker();

    public PanierService(PanierRepository panierRepository,
                         ArticlePanierRepository articlePanierRepository,
                         OptionProduitRepository optionProduitRepository,
                         OptionChoisieRepository optionChoisieRepository,
                         UtilisateurService utilisateurService,
                         VehiculeService vehiculeService) {
        this.panierRepository = panierRepository;
        this.articlePanierRepository = articlePanierRepository;
        this.optionProduitRepository = optionProduitRepository;
        this.optionChoisieRepository = optionChoisieRepository;
        this.utilisateurService = utilisateurService;
        this.vehiculeService = vehiculeService;
    }

    public Panier getOrCreatePanier(int utilisateurId) {
        Utilisateur u = utilisateurService.getUserById(utilisateurId);
        return panierRepository.findByUtilisateur(u).orElseGet(() -> {
            Panier p = new Panier();
            p.setUtilisateur(u);
            return panierRepository.save(p);
        });
    }

    public Panier ajouterVehicule(int utilisateurId, Long vehiculeId) {
        Panier panier = getOrCreatePanier(utilisateurId);
        snapshot(panier);

        Vehicule v = vehiculeService.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Vehicule introuvable"));

        AjouterVehiculeCommand cmd = new AjouterVehiculeCommand(panier, v);
        cmd.execute();

        ArticlePanier article = cmd.getArticle();
        articlePanierRepository.save(article);
        return panierRepository.save(panier);
    }

    public Panier retirerArticle(int utilisateurId, Long articleId) {
        Panier panier = getOrCreatePanier(utilisateurId);
        snapshot(panier);

        ArticlePanier article = articlePanierRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article introuvable"));

        if (!article.getPanier().getId().equals(panier.getId())) {
            throw new RuntimeException("Article n'appartient pas au panier de l'utilisateur");
        }

        RetirerArticleCommand cmd = new RetirerArticleCommand(panier, article);
        cmd.execute();

        articlePanierRepository.delete(article);
        return panierRepository.save(panier);
    }

    public Panier ajouterOption(int utilisateurId, Long articleId, String optionCode) {
        Panier panier = getOrCreatePanier(utilisateurId);
        snapshot(panier);

        ArticlePanier article = articlePanierRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article introuvable"));

        OptionProduit option = optionProduitRepository.findByCode(optionCode)
                .orElseThrow(() -> new RuntimeException("Option inconnue"));

        List<String> existCodes = article.getOptions().stream().map(OptionChoisie::getCode).toList();
        for (String inc : option.getIncompatibles()) {
            if (existCodes.contains(inc)) {
                throw new RuntimeException("Option incompatible: " + optionCode + " avec " + inc);
            }
        }

        AjouterOptionCommand cmd = new AjouterOptionCommand(article, option);
        cmd.execute();

        optionChoisieRepository.save(cmd.getOptionChoisie());
        return panierRepository.save(panier);
    }

    public Panier retirerOption(int utilisateurId, Long optionChoisieId) {
        Panier panier = getOrCreatePanier(utilisateurId);
        snapshot(panier);

        OptionChoisie oc = optionChoisieRepository.findById(optionChoisieId)
                .orElseThrow(() -> new RuntimeException("Option choisie introuvable"));

        ArticlePanier article = oc.getArticlePanier();
        RetirerOptionCommand cmd = new RetirerOptionCommand(article, oc);
        cmd.execute();

        optionChoisieRepository.delete(oc);
        return panierRepository.save(panier);
    }

    public Panier undo(int utilisateurId) {
        Panier panier = getOrCreatePanier(utilisateurId);
        PanierMemento m = caretaker.popUndo();
        if (m == null) return panier;
        Panier restored = restoreSnapshot(panier, m);
        caretaker.pushRedo(new PanierMemento(clonePanier(restored)));
        return panierRepository.save(restored);
    }

    public Panier redo(int utilisateurId) {
        Panier panier = getOrCreatePanier(utilisateurId);
        PanierMemento m = caretaker.popRedo();
        if (m == null) return panier;
        Panier restored = restoreSnapshot(panier, m);
        caretaker.pushUndo(new PanierMemento(clonePanier(restored)));
        return panierRepository.save(restored);
    }

    private void snapshot(Panier panier) {
        caretaker.pushUndo(new PanierMemento(clonePanier(panier)));
    }

    private Panier clonePanier(Panier original) {
        Panier p = new Panier();
        p.setUtilisateur(original.getUtilisateur());
        for (ArticlePanier a : original.getArticles()) {
            ArticlePanier copy = new ArticlePanier();
            copy.setPanier(p);
            copy.setVehicule(a.getVehicule());
            copy.setQuantite(a.getQuantite());
            for (OptionChoisie oc : a.getOptions()) {
                OptionChoisie occ = new OptionChoisie();
                occ.setArticlePanier(copy);
                occ.setOption(oc.getOption());
                copy.getOptions().add(occ);
            }
            p.getArticles().add(copy);
        }
        return p;
    }

    private Panier restoreSnapshot(Panier current, PanierMemento m) {
        Panier snap = m.getSnapshot();
        current.getArticles().clear();
        for (ArticlePanier a : snap.getArticles()) {
            ArticlePanier persisted = new ArticlePanier();
            persisted.setPanier(current);
            persisted.setVehicule(a.getVehicule());
            persisted.setQuantite(a.getQuantite());
            articlePanierRepository.save(persisted);

            for (OptionChoisie oc : a.getOptions()) {
                OptionChoisie persistedOc = new OptionChoisie();
                persistedOc.setArticlePanier(persisted);
                persistedOc.setOption(oc.getOption());
                optionChoisieRepository.save(persistedOc);
                persisted.getOptions().add(persistedOc);
            }
            current.getArticles().add(persisted);
        }
        return current;
    }
}
