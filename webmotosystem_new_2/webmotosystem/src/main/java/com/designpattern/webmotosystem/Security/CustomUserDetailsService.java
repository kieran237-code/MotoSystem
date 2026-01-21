package com.designpattern.webmotosystem.Security;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException; // Import manquant ajouté ici
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Recherche par email car l'ID est retiré du token JWT
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable avec l'email : " + email));

        // Vérification du statut du compte
        if (!utilisateur.isActif()) {
            throw new DisabledException("Compte non activé. Veuillez vérifier vos emails.");
        }

        // Retourne l'utilisateur pour Spring Security
        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getPassword()) 
                .roles(utilisateur.getRole().name()) 
                .build();
    }
}