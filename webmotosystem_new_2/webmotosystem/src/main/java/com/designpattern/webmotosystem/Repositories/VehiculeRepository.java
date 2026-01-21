package com.designpattern.webmotosystem.Repositories;

import com.designpattern.webmotosystem.Entities.Vehicule.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findAllByOrderByPrixBaseAsc();

    List<Vehicule> findAllByOrderByPrixBaseDesc();

    List<Vehicule> findByModeleContainingIgnoreCase(String modele);

    List<Vehicule> findByMarqueContainingIgnoreCase(String marque);

    // Pour recherche avancee avec ET / OU
    List<Vehicule> findByMarqueContainingIgnoreCaseAndCouleurContainingIgnoreCase(String marque, String couleur);

    List<Vehicule> findByMarqueContainingIgnoreCaseOrCouleurContainingIgnoreCase(String marque, String couleur);

    List<Vehicule> findByEstSoldeTrue();

    List<Vehicule> findByAnnee(int annee);

    List<Vehicule> findByMarqueContainingIgnoreCaseAndModeleContainingIgnoreCase(String marque, String modele);

    List<Vehicule> findByMarqueContainingIgnoreCaseOrModeleContainingIgnoreCase(String marque, String modele);

    List<Vehicule> findByModeleContainingIgnoreCaseAndCouleurContainingIgnoreCase(String modele, String couleur);

    List<Vehicule> findByModeleContainingIgnoreCaseOrCouleurContainingIgnoreCase(String modele, String couleur);

    List<Vehicule> findByAnneeAndMarqueContainingIgnoreCase(int annee, String marque);

    List<Vehicule> findByAnneeOrMarqueContainingIgnoreCase(int annee, String marque);
}