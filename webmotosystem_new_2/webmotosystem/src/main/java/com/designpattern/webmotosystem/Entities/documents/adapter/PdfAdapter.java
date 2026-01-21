package com.designpattern.webmotosystem.Entities.documents.adapter;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import com.designpattern.webmotosystem.Entities.Commande.Commande;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;

public class PdfAdapter implements Document {
    private String type;
    private Utilisateur client;
    private Vehicule vehicule;
    private Commande commande;

    public PdfAdapter(String type, Utilisateur client, Vehicule vehicule, Commande commande) {
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
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            PDPageContentStream cs = new PDPageContentStream(doc, page);
            float marginLeft = 50;
            float y = 750;

            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            DecimalFormat df = new DecimalFormat("#,##0.00");

            // En-tête
            cs.beginText();
            cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
            cs.newLineAtOffset(marginLeft, y);
            cs.showText(type);
            cs.endText();
            y -= 30;

            cs.beginText();
            cs.setFont(PDType1Font.HELVETICA, 10);
            cs.newLineAtOffset(marginLeft, y);
            cs.showText("Document N° " + commande.getNumCommande());
            cs.endText();
            y -= 15;

            cs.beginText();
            cs.setFont(PDType1Font.HELVETICA, 10);
            cs.newLineAtOffset(marginLeft, y);
            cs.showText("Date d'emission : " + sdf.format(commande.getDateCommande()));
            cs.endText();
            y -= 30;

            // Ligne de séparation
            cs.setLineWidth(1f);
            cs.moveTo(marginLeft, y);
            cs.lineTo(550, y);
            cs.stroke();
            y -= 20;

            String normalizedType = type.toLowerCase().trim();

            if (normalizedType.contains("demande")) {
                // ==================== DEMANDE D'IMMATRICULATION ====================
                y = writeSection(cs, marginLeft, y, "Informations du Demandeur",
                        new String[]{
                            "Nom complet : " + client.getNom(),
                            "Email : " + client.getEmail(),
                            "Telephone : " + (client.getAdresse() != null && client.getAdresse().getTelephone() != null ? client.getAdresse().getTelephone() : "Non renseigne"),
                            "Ville : " + (client.getAdresse() != null && client.getAdresse().getVille() != null ? client.getAdresse().getVille() : "Non renseigne"),
                            "Pays : " + (client.getAdresse() != null && client.getAdresse().getPays() != null ? client.getAdresse().getPays() : "Non renseigne")
                        });
                
                y = writeSection(cs, marginLeft, y, "Caracteristiques du Vehicule",
                        new String[]{
                            "Marque : " + vehicule.getMarque(),
                            "Modele : " + vehicule.getModele(),
                            "Annee : " + vehicule.getAnnee(),
                            "Couleur : " + vehicule.getCouleur(),
                            "Type : " + vehicule.getType(),
                            "Energie : " + vehicule.getEnergie(),
                            "Statut : " + vehicule.getStatus()
                        });

            } else if (normalizedType.contains("cession")) {
                // ==================== CERTIFICAT DE CESSION ====================
                y = writeSection(cs, marginLeft, y, "Informations du Cedant",
                        new String[]{
                            "Nom complet : " + client.getNom(),
                            "Email : " + client.getEmail(),
                            "Telephone : " + (client.getAdresse() != null && client.getAdresse().getTelephone() != null ? client.getAdresse().getTelephone() : "Non renseigne"),
                            "Adresse : " + (client.getAdresse() != null ? 
                                (client.getAdresse().getVille() != null ? client.getAdresse().getVille() : "") + ", " +
                                (client.getAdresse().getPays() != null ? client.getAdresse().getPays() : "") : "Non renseigne")
                        });
                
                y = writeSection(cs, marginLeft, y, "Vehicule Cede",
                        new String[]{
                            "Immatriculation : " + (vehicule.getReference() != null ? vehicule.getReference() : "Non assignee"),
                            "Marque : " + vehicule.getMarque(),
                            "Modele : " + vehicule.getModele(),
                            "Annee : " + vehicule.getAnnee(),
                            "Couleur : " + vehicule.getCouleur(),
                            "Kilometrage : " + new DecimalFormat("#,###").format(vehicule.getKilometrage()) + " km",
                            "Type : " + vehicule.getType() + " " + vehicule.getEnergie()
                        });

                y = writeSection(cs, marginLeft, y, "Details de la Cession",
                        new String[]{
                            "Date de cession : " + sdf.format(commande.getDateCommande()),
                            "Statut : " + commande.getEtatCommande(),
                            "Pays de livraison : " + (commande.getPaysLivraison() != null ? commande.getPaysLivraison() : "Non specifie")
                        });

            } else if (normalizedType.contains("commande")) {
                // ==================== BON DE COMMANDE ====================
                y = writeSection(cs, marginLeft, y, "Client",
                        new String[]{
                            "Nom complet : " + client.getNom(),
                            "Email : " + client.getEmail(),
                            "Telephone : " + (client.getAdresse() != null && client.getAdresse().getTelephone() != null ? client.getAdresse().getTelephone() : "Non renseigne"),
                            "Adresse de livraison : " + (client.getAdresse() != null ? 
                                (client.getAdresse().getVille() != null ? client.getAdresse().getVille() : "") + ", " +
                                (client.getAdresse().getPays() != null ? client.getAdresse().getPays() : "") : "Non renseigne")
                        });
                
                y = writeSection(cs, marginLeft, y, "Details du Vehicule Commande",
                        new String[]{
                            "Marque : " + vehicule.getMarque(),
                            "Modele : " + vehicule.getModele(),
                            "Annee : " + vehicule.getAnnee(),
                            "Couleur : " + vehicule.getCouleur(),
                            "Type : " + vehicule.getType() + " " + vehicule.getEnergie(),
                            "Statut : " + (vehicule.isEstSolde() ? "SOLDE" : vehicule.getStatus().toString())
                        });

                // ✅ AFFICHER LES OPTIONS SI PRÉSENTES
                if (commande.getOptions() != null && !commande.getOptions().isEmpty()) {
                    int nbOptions = commande.getOptions().size();
                    String[] optionsArray = new String[nbOptions + 1];
                    double totalOptions = 0;
                    
                    for (int i = 0; i < nbOptions; i++) {
                        var option = commande.getOptions().get(i);
                        optionsArray[i] = "Option " + (i + 1) + ": " + option.getNom() + " (+" + df.format(option.getPrix()) + " EUR)";
                        totalOptions += option.getPrix();
                    }
                    
                    optionsArray[nbOptions] = "Total options : " + df.format(totalOptions) + " EUR";
                    
                    y = writeSection(cs, marginLeft, y, "Options Selectionnees", optionsArray);
                }

                // ✅ RÉCAPITULATIF FINANCIER ENRICHI
                double totalOptions = 0;
                if (commande.getOptions() != null && !commande.getOptions().isEmpty()) {
                    totalOptions = commande.getOptions().stream()
                        .mapToDouble(opt -> opt.getPrix())
                        .sum();
                }
                
                double frais = commande.calculerFraisSpecifique();
                double total = commande.calculerTotal(0);
                
                // Construction dynamique du tableau financier
                String[] financialInfo;
                if (totalOptions > 0 && frais > 0) {
                    financialInfo = new String[]{
                        "Prix de base : " + df.format(vehicule.getPrixBase()) + " EUR",
                        "Total options : " + df.format(totalOptions) + " EUR",
                        "Frais specifiques : " + df.format(frais) + " EUR",
                        "PRIX TOTAL TTC : " + df.format(total) + " EUR"
                    };
                } else if (totalOptions > 0) {
                    financialInfo = new String[]{
                        "Prix de base : " + df.format(vehicule.getPrixBase()) + " EUR",
                        "Total options : " + df.format(totalOptions) + " EUR",
                        "PRIX TOTAL TTC : " + df.format(total) + " EUR"
                    };
                } else if (frais > 0) {
                    financialInfo = new String[]{
                        "Prix de base : " + df.format(vehicule.getPrixBase()) + " EUR",
                        "Frais specifiques : " + df.format(frais) + " EUR",
                        "PRIX TOTAL TTC : " + df.format(total) + " EUR"
                    };
                } else {
                    financialInfo = new String[]{
                        "Prix de base : " + df.format(vehicule.getPrixBase()) + " EUR",
                        "PRIX TOTAL TTC : " + df.format(total) + " EUR"
                    };
                }
                
                y = writeSection(cs, marginLeft, y, "Recapitulatif Financier", financialInfo);

                y = writeSection(cs, marginLeft, y, "Informations de Livraison",
                        new String[]{
                            "Pays de livraison : " + (commande.getPaysLivraison() != null ? commande.getPaysLivraison() : "Non specifie"),
                            "Statut de la commande : " + commande.getEtatCommande(),
                            "Paiement : " + (commande.isPaye() ? "PAYE" : "EN ATTENTE")
                        });
            }

            // Pied de page
            y -= 20;
            cs.setLineWidth(0.5f);
            cs.moveTo(marginLeft, y);
            cs.lineTo(550, y);
            cs.stroke();
            y -= 15;

            cs.beginText();
            cs.setFont(PDType1Font.HELVETICA, 8);
            cs.newLineAtOffset(marginLeft, y);
            cs.showText("Document genere automatiquement le " + sdf.format(new java.util.Date()));
            cs.endText();
            y -= 10;

            cs.beginText();
            cs.setFont(PDType1Font.HELVETICA, 8);
            cs.newLineAtOffset(marginLeft, y);
            cs.showText("WebMotoSystem (c) 2026 - Tous droits reserves");
            cs.endText();

            cs.close();
            doc.save("document.pdf");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private float writeSection(PDPageContentStream cs, float x, float y, String title, String[] lines) throws IOException {
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 14);
        cs.newLineAtOffset(x, y);
        cs.showText(title);
        cs.endText();
        y -= 20;

        for (String line : lines) {
            cs.beginText();
            cs.setFont(PDType1Font.HELVETICA, 11);
            cs.newLineAtOffset(x + 20, y);
            cs.showText(line);
            cs.endText();
            y -= 15;
        }
        y -= 10;
        return y;
    }

    @Override
    public String getContent() {
        return type;
    }

    @Override
    public String getType() {
        return "PdfAdapter";
    }
}