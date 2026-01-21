package com.designpattern.webmotosystem.DTO;

public class VehiculeCommandeResponse {
    private String typeVehicule;
    private String reference;
    private String modele;
    private String marque;
    private int annee;
    private String couleur;
    private double prixBase;
    private boolean estSolde;
    private double kilometrage;
    private String status;
    private String energie;
    private String type;

    // Getters / Setters
    public String getTypeVehicule() { return typeVehicule; }
    public void setTypeVehicule(String typeVehicule) { this.typeVehicule = typeVehicule; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getModele() { return modele; }
    public void setModele(String modele) { this.modele = modele; }
    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }
    public int getAnnee() { return annee; }
    public void setAnnee(int annee) { this.annee = annee; }
    public String getCouleur() { return couleur; }
    public void setCouleur(String couleur) { this.couleur = couleur; }
    public double getPrixBase() { return prixBase; }
    public void setPrixBase(double prixBase) { this.prixBase = prixBase; }
    public boolean isEstSolde() { return estSolde; }
    public void setEstSolde(boolean estSolde) { this.estSolde = estSolde; }
    public double getKilometrage() { return kilometrage; }
    public void setKilometrage(double kilometrage) { this.kilometrage = kilometrage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getEnergie() { return energie; }
    public void setEnergie(String energie) { this.energie = energie; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
