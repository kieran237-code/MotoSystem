package com.designpattern.webmotosystem.Mappers;

import com.designpattern.webmotosystem.DTO.panier.PanierResponse;
import com.designpattern.webmotosystem.Entities.panier.ArticlePanier;
import com.designpattern.webmotosystem.Entities.panier.OptionChoisie;
import com.designpattern.webmotosystem.Entities.panier.Panier;

import java.util.stream.Collectors;

public class PanierMapper {

    public static PanierResponse toDto(Panier panier) {
        PanierResponse dto = new PanierResponse();
        dto.setPanierId(panier.getId());
        dto.setUtilisateurId(panier.getUtilisateur().getId());
        dto.setMontantTotal(panier.getMontantTotal());

        dto.setArticles(panier.getArticles().stream().map(PanierMapper::toArticleDto).collect(Collectors.toList()));

        return dto;
    }

   private static PanierResponse.ArticleResponse toArticleDto(ArticlePanier a) {
    PanierResponse.ArticleResponse ar = new PanierResponse.ArticleResponse();
    ar.articleId = a.getId();
    ar.vehiculeId = a.getVehicule().getId();
    ar.reference = a.getVehicule().getReference();
    ar.modele = a.getVehicule().getModele();
    ar.marque = a.getVehicule().getMarque();
    ar.quantite = a.getQuantite();
    ar.montantTotal = a.getMontantTotal();

    // 🔹 Gestion des images depuis Vehicule
    if (a.getVehicule().getImages() != null && !a.getVehicule().getImages().isEmpty()) {
        ar.image = a.getVehicule().getImages().get(0);   // image principale
        ar.images = a.getVehicule().getImages();        // toutes les images
    }

    // 🔹 Options choisies
    ar.options = a.getOptions().stream().map(PanierMapper::toOptionDto).collect(Collectors.toList());

    return ar;
}


    private static PanierResponse.OptionResponse toOptionDto(OptionChoisie oc) {
        PanierResponse.OptionResponse or = new PanierResponse.OptionResponse();
        or.optionId = oc.getId();
        or.code = oc.getOption().getCode();
        or.nom = oc.getOption().getNom();
        or.prix = oc.getOption().getPrix();
        return or;
    }
}
