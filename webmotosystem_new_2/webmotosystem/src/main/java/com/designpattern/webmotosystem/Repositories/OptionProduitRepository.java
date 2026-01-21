// src/main/java/com/designpattern/webmotosystem/Repositories/OptionProduitRepository.java
package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.panier.OptionProduit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OptionProduitRepository extends JpaRepository<OptionProduit, Long> {
    Optional<OptionProduit> findByCode(String code);
}
