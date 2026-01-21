package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.Commande.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
    // Spring Data JPA génère automatiquement la requête : 
    // SELECT * FROM commande WHERE client_id = ?
    List<Commande> findByClientId(int clientId);
}