package com.designpattern.webmotosystem.DTO;

import java.util.List;

public class CommandeResponse {
    private Long id;
    private String numCommande;
    private String dateCommande;
    private double montant;
    private String etatCommande;
    private String paysLivraison;
    private String clientNom;
    private String clientEmail;
    private VehiculeCommandeResponse vehicule;
    
    // ✅ NOUVELLE PROPRIÉTÉ
    private List<OptionResponse> options;

    // ✅ Classe interne pour les options
    public static class OptionResponse {
        private String code;
        private String nom;
        private double prix;

        public OptionResponse(String code, String nom, double prix) {
            this.code = code;
            this.nom = nom;
            this.prix = prix;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }
        public double getPrix() { return prix; }
        public void setPrix(double prix) { this.prix = prix; }
    }

    // Getters / Setters existants
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumCommande() { return numCommande; }
    public void setNumCommande(String numCommande) { this.numCommande = numCommande; }
    public String getDateCommande() { return dateCommande; }
    public void setDateCommande(String dateCommande) { this.dateCommande = dateCommande; }
    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }
    public String getEtatCommande() { return etatCommande; }
    public void setEtatCommande(String etatCommande) { this.etatCommande = etatCommande; }
    public String getPaysLivraison() { return paysLivraison; }
    public void setPaysLivraison(String paysLivraison) { this.paysLivraison = paysLivraison; }
    public String getClientNom() { return clientNom; }
    public void setClientNom(String clientNom) { this.clientNom = clientNom; }
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    public VehiculeCommandeResponse getVehicule() { return vehicule; }
    public void setVehicule(VehiculeCommandeResponse vehicule) { this.vehicule = vehicule; }
    
    // ✅ NOUVEAUX GETTERS/SETTERS
    public List<OptionResponse> getOptions() { return options; }
    public void setOptions(List<OptionResponse> options) { this.options = options; }
}