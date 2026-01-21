// src/main/java/com/designpattern/webmotosystem/Repositories/OptionChoisieRepository.java
package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.panier.OptionChoisie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionChoisieRepository extends JpaRepository<OptionChoisie, Long> { }
