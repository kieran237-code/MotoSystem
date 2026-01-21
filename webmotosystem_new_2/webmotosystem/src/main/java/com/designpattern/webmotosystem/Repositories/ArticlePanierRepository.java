// src/main/java/com/designpattern/webmotosystem/Repositories/ArticlePanierRepository.java
package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.panier.ArticlePanier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticlePanierRepository extends JpaRepository<ArticlePanier, Long> { }
