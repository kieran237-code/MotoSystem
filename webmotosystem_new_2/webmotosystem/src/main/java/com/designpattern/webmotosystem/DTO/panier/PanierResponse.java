// src/main/java/com/designpattern/webmotosystem/DTO/panier/PanierResponse.java
package com.designpattern.webmotosystem.DTO.panier;

import java.util.List;

public class PanierResponse {
    private Long panierId;
    private int utilisateurId;
    private double montantTotal;
    private List<ArticleResponse> articles;
             public String image;
         public List<String> images; 
    public static class ArticleResponse {
        public Long articleId;
        public Long vehiculeId;
        public String reference;
        public String modele;
        public String marque;
        public int quantite;
        public double montantTotal;
        public List<OptionResponse> options;
        public List<String> images;
        public String image;

    }

    public static class OptionResponse {
        public Long optionId;
        public String code;
        public String nom;
        public double prix;
    }

    public Long getPanierId() { return panierId; }
    public void setPanierId(Long panierId) { this.panierId = panierId; }
    public int getUtilisateurId() { return utilisateurId; }
    public void setUtilisateurId(int utilisateurId) { this.utilisateurId = utilisateurId; }
    public double getMontantTotal() { return montantTotal; }
    public void setMontantTotal(double montantTotal) { this.montantTotal = montantTotal; }
    public List<ArticleResponse> getArticles() { return articles; }
    public void setArticles(List<ArticleResponse> articles) { this.articles = articles; }
    public String getImage() { return image; } 
    public void setImage(String image) { this.image = image; }
}
