// src/main/java/com/designpattern/webmotosystem/Repositories/PanierRepository.java
package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.panier.Panier;
import com.designpattern.webmotosystem.Entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PanierRepository extends JpaRepository<Panier, Long> {
    Optional<Panier> findByUtilisateur(Utilisateur utilisateur);
}
