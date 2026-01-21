package com.designpattern.webmotosystem.Entities.documents.adapter;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import com.designpattern.webmotosystem.Entities.Commande.Commande;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;

public class HtmlDocument implements Document {
    private String type;
    private Utilisateur client;
    private Vehicule vehicule;
    private Commande commande;

    public HtmlDocument(String type, Utilisateur client, Vehicule vehicule, Commande commande) {
        this.type = type;
        this.client = client;
        this.vehicule = vehicule;
        this.commande = commande;
    }

    @Override
    public void setContent(String content) { 
        this.type = content; 
    }

    @Override
    public void print() {
        try (OutputStreamWriter writer = new OutputStreamWriter(
                new FileOutputStream("document.html"), StandardCharsets.UTF_8)) {
            
            // Style CSS intégré
            writer.write("<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n");
            writer.write("<meta charset=\"UTF-8\">\n");
            writer.write("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
            writer.write("<title>" + type + "</title>\n");
            writer.write("<style>\n");
            writer.write("body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f5f5; }\n");
            writer.write(".document { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }\n");
            writer.write("h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }\n");
            writer.write("h2 { color: #34495e; margin-top: 30px; border-left: 4px solid #3498db; padding-left: 10px; }\n");
            writer.write(".info-grid { display: grid; grid-template-columns: 200px 1fr; gap: 10px; margin: 15px 0; }\n");
            writer.write(".label { font-weight: bold; color: #7f8c8d; }\n");
            writer.write(".value { color: #2c3e50; }\n");
            writer.write(".header { text-align: center; margin-bottom: 30px; }\n");
            writer.write(".footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ecf0f1; text-align: center; color: #95a5a6; font-size: 12px; }\n");
            writer.write(".badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }\n");
            writer.write(".badge-success { background: #2ecc71; color: white; }\n");
            writer.write(".badge-warning { background: #f39c12; color: white; }\n");
            writer.write(".badge-info { background: #3498db; color: white; }\n");
            writer.write(".highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }\n");
            writer.write(".option-item { background: #e8f5e9; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #4caf50; }\n");
            writer.write(".price-highlight { color: #27ae60; font-weight: bold; }\n");
            writer.write("</style>\n");
            writer.write("</head>\n<body>\n");
            writer.write("<div class='document'>\n");
            
            // Normalisation du type
            String normalizedType = type.toLowerCase().trim();
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            DecimalFormat df = new DecimalFormat("#,##0.00");
            
            // En-tête du document
            writer.write("<div class='header'>\n");
            writer.write("<h1>" + type + "</h1>\n");
            writer.write("<p>Document N° <strong>" + commande.getNumCommande() + "</strong></p>\n");
            writer.write("<p>Date d'émission : " + sdf.format(commande.getDateCommande()) + "</p>\n");
            writer.write("</div>\n");
            
            if (normalizedType.contains("demande")) {
                // ==================== DEMANDE D'IMMATRICULATION ====================
                writer.write("<h2>📋 Informations du Demandeur</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Nom complet :</div><div class='value'>" + client.getNom() + "</div>\n");
                writer.write("<div class='label'>Email :</div><div class='value'>" + client.getEmail() + "</div>\n");
                if (client.getAdresse() != null) {
                    writer.write("<div class='label'>Téléphone :</div><div class='value'>" + (client.getAdresse().getTelephone() != null ? client.getAdresse().getTelephone() : "Non renseigné") + "</div>\n");
                    writer.write("<div class='label'>Ville :</div><div class='value'>" + (client.getAdresse().getVille() != null ? client.getAdresse().getVille() : "Non renseigné") + "</div>\n");
                    writer.write("<div class='label'>Pays :</div><div class='value'>" + (client.getAdresse().getPays() != null ? client.getAdresse().getPays() : "Non renseigné") + "</div>\n");
                }
                writer.write("</div>\n");

                writer.write("<h2>🚗 Caractéristiques du Véhicule</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Marque :</div><div class='value'>" + vehicule.getMarque() + "</div>\n");
                writer.write("<div class='label'>Modèle :</div><div class='value'>" + vehicule.getModele() + "</div>\n");
                writer.write("<div class='label'>Année :</div><div class='value'>" + vehicule.getAnnee() + "</div>\n");
                writer.write("<div class='label'>Couleur :</div><div class='value'>" + vehicule.getCouleur() + "</div>\n");
                writer.write("<div class='label'>Type :</div><div class='value'>" + vehicule.getType() + "</div>\n");
                writer.write("<div class='label'>Énergie :</div><div class='value'>" + vehicule.getEnergie() + "</div>\n");
                writer.write("<div class='label'>Statut :</div><div class='value'><span class='badge badge-info'>" + vehicule.getStatus() + "</span></div>\n");
                writer.write("</div>\n");

                writer.write("<div class='highlight'>\n");
                writer.write("<strong>⚠️ Important :</strong> Cette demande d'immatriculation doit être accompagnée des pièces justificatives requises par l'administration.\n");
                writer.write("</div>\n");

            } else if (normalizedType.contains("cession")) {
                // ==================== CERTIFICAT DE CESSION ====================
                writer.write("<h2>👤 Informations du Cédant</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Nom complet :</div><div class='value'>" + client.getNom() + "</div>\n");
                writer.write("<div class='label'>Email :</div><div class='value'>" + client.getEmail() + "</div>\n");
                if (client.getAdresse() != null) {
                    writer.write("<div class='label'>Téléphone :</div><div class='value'>" + (client.getAdresse().getTelephone() != null ? client.getAdresse().getTelephone() : "Non renseigné") + "</div>\n");
                    writer.write("<div class='label'>Adresse complète :</div><div class='value'>" + 
                        (client.getAdresse().getVille() != null ? client.getAdresse().getVille() : "") + ", " +
                        (client.getAdresse().getPays() != null ? client.getAdresse().getPays() : "") + 
                        "</div>\n");
                }
                writer.write("</div>\n");

                writer.write("<h2>🚗 Véhicule Cédé</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Immatriculation :</div><div class='value'><strong>" + (vehicule.getReference() != null ? vehicule.getReference() : "Non assignée") + "</strong></div>\n");
                writer.write("<div class='label'>Marque :</div><div class='value'>" + vehicule.getMarque() + "</div>\n");
                writer.write("<div class='label'>Modèle :</div><div class='value'>" + vehicule.getModele() + "</div>\n");
                writer.write("<div class='label'>Année :</div><div class='value'>" + vehicule.getAnnee() + "</div>\n");
                writer.write("<div class='label'>Couleur :</div><div class='value'>" + vehicule.getCouleur() + "</div>\n");
                writer.write("<div class='label'>Kilométrage :</div><div class='value'>" + new DecimalFormat("#,###").format(vehicule.getKilometrage()) + " km</div>\n");
                writer.write("<div class='label'>Type :</div><div class='value'>" + vehicule.getType() + " " + vehicule.getEnergie() + "</div>\n");
                writer.write("</div>\n");

                writer.write("<h2>📝 Détails de la Cession</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Date de cession :</div><div class='value'>" + sdf.format(commande.getDateCommande()) + "</div>\n");
                writer.write("<div class='label'>Statut :</div><div class='value'><span class='badge badge-warning'>" + commande.getEtatCommande() + "</span></div>\n");
                writer.write("<div class='label'>Pays de livraison :</div><div class='value'>" + (commande.getPaysLivraison() != null ? commande.getPaysLivraison() : "Non spécifié") + "</div>\n");
                writer.write("</div>\n");

                writer.write("<div class='highlight'>\n");
                writer.write("<strong>📌 Note :</strong> Le présent certificat atteste de la cession du véhicule mentionné ci-dessus. Il doit être conservé par les deux parties.\n");
                writer.write("</div>\n");

            } else if (normalizedType.contains("commande")) {
                // ==================== BON DE COMMANDE ====================
                writer.write("<h2>👤 Client</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Nom complet :</div><div class='value'>" + client.getNom() + "</div>\n");
                writer.write("<div class='label'>Email :</div><div class='value'>" + client.getEmail() + "</div>\n");
                if (client.getAdresse() != null) {
                    writer.write("<div class='label'>Téléphone :</div><div class='value'>" + (client.getAdresse().getTelephone() != null ? client.getAdresse().getTelephone() : "Non renseigné") + "</div>\n");
                    writer.write("<div class='label'>Adresse de livraison :</div><div class='value'>" + 
                        (client.getAdresse().getVille() != null ? client.getAdresse().getVille() : "") + ", " +
                        (client.getAdresse().getPays() != null ? client.getAdresse().getPays() : "") + 
                        "</div>\n");
                }
                writer.write("</div>\n");

                writer.write("<h2>🚗 Détails du Véhicule Commandé</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Marque :</div><div class='value'>" + vehicule.getMarque() + "</div>\n");
                writer.write("<div class='label'>Modèle :</div><div class='value'>" + vehicule.getModele() + "</div>\n");
                writer.write("<div class='label'>Année :</div><div class='value'>" + vehicule.getAnnee() + "</div>\n");
                writer.write("<div class='label'>Couleur :</div><div class='value'>" + vehicule.getCouleur() + "</div>\n");
                writer.write("<div class='label'>Type :</div><div class='value'>" + vehicule.getType() + " " + vehicule.getEnergie() + "</div>\n");
                writer.write("<div class='label'>Statut :</div><div class='value'><span class='badge " + (vehicule.isEstSolde() ? "badge-warning" : "badge-info") + "'>" + (vehicule.isEstSolde() ? "SOLDÉ" : vehicule.getStatus().toString()) + "</span></div>\n");
                writer.write("</div>\n");

                // ✅ AFFICHER LES OPTIONS SI PRÉSENTES
                if (commande.getOptions() != null && !commande.getOptions().isEmpty()) {
                    writer.write("<h2>🎨 Options Sélectionnées</h2>\n");
                    
                    double totalOptions = 0;
                    for (int i = 0; i < commande.getOptions().size(); i++) {
                        var option = commande.getOptions().get(i);
                        writer.write("<div class='option-item'>\n");
                        writer.write("<strong>Option " + (i + 1) + ":</strong> " + option.getNom());
                        writer.write(" <span class='price-highlight'>(+ " + df.format(option.getPrix()) + " €)</span>\n");
                        writer.write("</div>\n");
                        totalOptions += option.getPrix();
                    }
                    
                    writer.write("<div class='info-grid' style='margin-top: 15px;'>\n");
                    writer.write("<div class='label'><strong>Total options :</strong></div>");
                    writer.write("<div class='value'><strong class='price-highlight'>" + df.format(totalOptions) + " €</strong></div>\n");
                    writer.write("</div>\n");
                }

                // ✅ RÉCAPITULATIF FINANCIER ENRICHI
                writer.write("<h2>💰 Récapitulatif Financier</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Prix de base :</div><div class='value'>" + df.format(vehicule.getPrixBase()) + " €</div>\n");
                
                // Afficher le total des options
                if (commande.getOptions() != null && !commande.getOptions().isEmpty()) {
                    double totalOptions = commande.getOptions().stream()
                        .mapToDouble(opt -> opt.getPrix())
                        .sum();
                    writer.write("<div class='label'>Total options :</div><div class='value'>" + df.format(totalOptions) + " €</div>\n");
                }
                
                double frais = commande.calculerFraisSpecifique();
                if (frais > 0) {
                    writer.write("<div class='label'>Frais spécifiques :</div><div class='value'>" + df.format(frais) + " €</div>\n");
                }
                
                double total = commande.calculerTotal(0);
                writer.write("<div class='label'><strong>PRIX TOTAL TTC :</strong></div><div class='value'><strong style='color: #27ae60; font-size: 1.2em;'>" + df.format(total) + " €</strong></div>\n");
                writer.write("</div>\n");

                writer.write("<h2>📦 Informations de Livraison</h2>\n");
                writer.write("<div class='info-grid'>\n");
                writer.write("<div class='label'>Pays de livraison :</div><div class='value'>" + (commande.getPaysLivraison() != null ? commande.getPaysLivraison() : "Non spécifié") + "</div>\n");
                writer.write("<div class='label'>Statut de la commande :</div><div class='value'><span class='badge badge-" + getBadgeClass(commande.getEtatCommande().toString()) + "'>" + commande.getEtatCommande() + "</span></div>\n");
                writer.write("<div class='label'>Paiement :</div><div class='value'><span class='badge " + (commande.isPaye() ? "badge-success" : "badge-warning") + "'>" + (commande.isPaye() ? "PAYÉ" : "EN ATTENTE") + "</span></div>\n");
                writer.write("</div>\n");

                writer.write("<div class='highlight'>\n");
                writer.write("<strong>✅ Conditions :</strong> Le véhicule sera livré sous 15 jours ouvrés après confirmation du paiement intégral.\n");
                writer.write("</div>\n");
            }
            
            // Pied de page
            writer.write("<div class='footer'>\n");
            writer.write("<p>Document généré automatiquement le " + sdf.format(new java.util.Date()) + "</p>\n");
            writer.write("<p>WebMotoSystem © 2026 - Tous droits réservés</p>\n");
            writer.write("</div>\n");
            
            writer.write("</div>\n</body></html>");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String getBadgeClass(String etat) {
        return switch (etat) {
            case "VALIDEE" -> "success";
            case "LIVREE" -> "info";
            default -> "warning";
        };
    }

    @Override
    public String getContent() { 
        return type; 
    }

    @Override
    public String getType() { 
        return "HtmlDocument"; 
    }
}