package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Validation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ValidationRepository extends JpaRepository<Validation,Integer> {
    Optional<Validation> findByCode(String code);
    Optional<Validation> findByUtilisateur(Utilisateur utilisateur);
}
