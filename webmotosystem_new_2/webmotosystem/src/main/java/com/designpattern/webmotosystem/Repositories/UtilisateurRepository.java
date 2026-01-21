package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    
    Optional<Utilisateur> findByEmail(String email);

    List<Utilisateur> findByRole(Role role);

    // Ajouté pour permettre au service de trouver les infos de la société vendeuse
    Optional<Utilisateur> findByRaisonSociale(String raisonSociale);
}