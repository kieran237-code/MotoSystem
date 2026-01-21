package com.designpattern.webmotosystem.Entities.Commande;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_commande", discriminatorType = DiscriminatorType.STRING)
public abstract class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String numCommande;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCommande;
    
    private double montant;
    private boolean paye;
    
    @Enumerated(EnumType.STRING)
    private EtatCommande etatCommande = EtatCommande.EN_COURS;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Utilisateur client;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Utilisateur vendeur;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Vehicule vehicule;
    
    private String paysLivraison;
    
    // ✅ NOUVELLE RELATION : Options de la commande
    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OptionCommande> options = new ArrayList<>();
    
    public Commande() {
        this.dateCommande = new Date();
    }
    
    // Template method
    public double calculerTotal(double taxe) {
        double frais = calculerFraisSpecifique();
        return montant + taxe + frais;
    }
    
    public abstract double calculerFraisSpecifique();
    
    public void changerEtatCommande(EtatCommande nouvelEtat) {
        this.etatCommande = nouvelEtat;
    }
    
    // ✅ Méthode helper pour ajouter une option
    public void ajouterOption(String code, String nom, double prix) {
        OptionCommande option = new OptionCommande();
        option.setCommande(this);
        option.setCode(code);
        option.setNom(nom);
        option.setPrix(prix);
        this.options.add(option);
    }
    
    // ====== Getters / Setters ======
    public Long getId() { return id; }
    public String getNumCommande() { return numCommande; }
    public void setNumCommande(String numCommande) { this.numCommande = numCommande; }
    public Date getDateCommande() { return dateCommande; }
    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }
    public boolean isPaye() { return paye; }
    public void setPaye(boolean paye) { this.paye = paye; }
    public EtatCommande getEtatCommande() { return etatCommande; }
    public Utilisateur getClient() { return client; }
    public void setClient(Utilisateur client) { this.client = client; }
    public Utilisateur getVendeur() { return vendeur; }
    public void setVendeur(Utilisateur vendeur) { this.vendeur = vendeur; }
    public Vehicule getVehicule() { return vehicule; }
    public void setVehicule(Vehicule vehicule) { this.vehicule = vehicule; }
    public String getPaysLivraison() { return paysLivraison; }
    public void setPaysLivraison(String paysLivraison) { this.paysLivraison = paysLivraison; }
    public List<OptionCommande> getOptions() { return options; }
    public void setOptions(List<OptionCommande> options) { this.options = options; }
}