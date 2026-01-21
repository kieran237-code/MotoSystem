package com.designpattern.webmotosystem.Mappers;

import com.designpattern.webmotosystem.DTO.CommandeResponse;
import com.designpattern.webmotosystem.DTO.VehiculeCommandeResponse;
import com.designpattern.webmotosystem.Entities.Commande.Commande;
import com.designpattern.webmotosystem.Entities.Vehicule.*;
import java.util.stream.Collectors;

public class CommandeMapper {
    public static CommandeResponse toDto(Commande commande) {
        CommandeResponse dto = new CommandeResponse();
        dto.setId(commande.getId());
        dto.setNumCommande(commande.getNumCommande());
        dto.setDateCommande(commande.getDateCommande().toString());
        dto.setMontant(commande.getMontant());
        dto.setEtatCommande(commande.getEtatCommande().name());
        dto.setPaysLivraison(commande.getPaysLivraison());
        dto.setClientNom(commande.getClient().getNom());
        dto.setClientEmail(commande.getClient().getEmail());

        Vehicule v = commande.getVehicule();
        VehiculeCommandeResponse vDto = new VehiculeCommandeResponse();
        vDto.setTypeVehicule(v.getClass().getSimpleName());
        vDto.setReference(v.getReference());
        vDto.setModele(v.getModele());
        vDto.setMarque(v.getMarque());
        vDto.setAnnee(v.getAnnee());
        vDto.setCouleur(v.getCouleur());
        vDto.setPrixBase(v.getPrixBase());
        vDto.setEstSolde(v.isEstSolde());
        vDto.setKilometrage(v.getKilometrage());
        vDto.setStatus(v.getStatus().name());

        if (v instanceof ScooterEssence) {
            vDto.setEnergie("Essence");
            vDto.setType("Scooter");
        }
        if (v instanceof ScooterElectrique) {
            vDto.setEnergie("Electrique");
            vDto.setType("Scooter");
        }
        if (v instanceof AutomobileEssence) {
            vDto.setEnergie("Essence");
            vDto.setType("Automobile");
        }
        if (v instanceof AutomobileElectrique) {
            vDto.setEnergie("Electrique");
            vDto.setType("Automobile");
        }

        dto.setVehicule(vDto);

        // ✅ MAPPER LES OPTIONS
        dto.setOptions(
            commande.getOptions().stream()
                .map(opt -> new CommandeResponse.OptionResponse(
                    opt.getCode(),
                    opt.getNom(),
                    opt.getPrix()
                ))
                .collect(Collectors.toList())
        );

        return dto;
    }
}