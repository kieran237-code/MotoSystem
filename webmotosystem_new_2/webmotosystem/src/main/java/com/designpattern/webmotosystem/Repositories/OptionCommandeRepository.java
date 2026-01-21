package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.Commande.OptionCommande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionCommandeRepository extends JpaRepository<OptionCommande, Long> {
}