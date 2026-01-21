package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Role;
import com.designpattern.webmotosystem.Entities.client.ClientEntreprise;
import com.designpattern.webmotosystem.Entities.client.Filiale;
import com.designpattern.webmotosystem.Entities.client.Societe;
import com.designpattern.webmotosystem.Repositories.UtilisateurRepository; // Correction ici
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service pour gerer les societes et leurs filiales.
 * Utilise le pattern Composite (Societe = Composite, Filiale = Leaf).
 */
@Service
@AllArgsConstructor
public class ClientService {

    // Nom corrigé pour correspondre à l'interface réelle
    private final UtilisateurRepository utilisateurRepository;

    /**
     * Retourne une societe avec ses filiales sous forme de Composite.
     */
    public ClientEntreprise construireSocieteAvecFiliales(int societeId) {
        Utilisateur societe = utilisateurRepository.findById(societeId)
                .orElseThrow(() -> new RuntimeException("Société introuvable"));

        if (societe.getRole() != Role.SOCIETE) {
            throw new RuntimeException("Cet utilisateur n'est pas une société");
        }

        Societe composite = new Societe(societe);

        // On récupère toutes les filiales rattachées à cette société
        List<Utilisateur> filiales = utilisateurRepository.findByRole(Role.CLIENT);

        for (Utilisateur f : filiales) {
             composite.ajouter(new Filiale(f));
        }

        return composite;
    }
}