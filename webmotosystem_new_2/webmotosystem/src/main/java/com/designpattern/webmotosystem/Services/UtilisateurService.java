package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Validation;
import com.designpattern.webmotosystem.Entities.Role;
import com.designpattern.webmotosystem.Repositories.UtilisateurRepository; // Correction ici
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Service
public class UtilisateurService {
    // Correction du nom de la variable et du type
    private final UtilisateurRepository utilisateurRepository; 
    private final ValidationService validationService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void inscription(Utilisateur utilisateur){
        utilisateur.setPassword(bCryptPasswordEncoder.encode(utilisateur.getPassword()));

        if(!utilisateur.getEmail().contains("@") || !utilisateur.getEmail().contains(".")){
            throw new RuntimeException("Adresse mail invalide");
        }

        if(utilisateurRepository.findByEmail(utilisateur.getEmail()).isPresent()){
            throw new RuntimeException("Cette adresse mail est déjà utilisée");
        }

        // On enregistre et on récupère l'objet avec son ID généré
        Utilisateur utilisateurSauvegarde = utilisateurRepository.save(utilisateur);
        validationService.enregister(utilisateurSauvegarde);
    }

    public List<Utilisateur> getAllUsers(){
        return utilisateurRepository.findAll();
    }

    public Utilisateur getUserById(int id){
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public Utilisateur getUserByEmail(String email){
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public List<Utilisateur> getUsersByRole(Role role){
        return utilisateurRepository.findByRole(role);
    }

    public void activation(Map<String,String> activation){
        Validation validation = validationService.lireEnFonctionDuCode(activation.get("code"));

        if(Instant.now().isAfter(validation.getExpiration())){
            throw new RuntimeException("Votre code a expiré");
        }

        Utilisateur utilisateurActive = utilisateurRepository.findById(validation.getUtilisateur().getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur inconnu"));

        utilisateurActive.setActif(true);
        utilisateurRepository.save(utilisateurActive);

        validation.setActivation(Instant.now());
        validationService.updateValidation(validation);
    }

    public void resendActivation(String email){
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if(utilisateur.isActif()){
            throw new RuntimeException("Utilisateur déjà activé");
        }

        validationService.enregister(utilisateur);
    }
}