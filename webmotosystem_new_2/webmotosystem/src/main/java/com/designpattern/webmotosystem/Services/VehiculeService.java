package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Vehicule.*;
import com.designpattern.webmotosystem.Repositories.VehiculeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class VehiculeService {

    private final VehiculeRepository vehiculeRepository;

    public VehiculeService(VehiculeRepository vehiculeRepository) {
        this.vehiculeRepository = vehiculeRepository;
    }

    // Récupérer tous les véhicules
    public List<Vehicule> findAll() {
        return vehiculeRepository.findAll();
    }

    // Récupérer un véhicule par ID
    public Optional<Vehicule> findById(Long id) {
        return vehiculeRepository.findById(id);
    }

    // Enregistrer un nouveau véhicule
    public Vehicule save(Vehicule vehicule) {
        return vehiculeRepository.save(vehicule);
    }

    // Mettre à jour un véhicule existant
    public Vehicule update(Long id, Vehicule vehicule) {
        return vehiculeRepository.findById(id)
                .map(existing -> {
                    existing.setReference(vehicule.getReference());
                    existing.setModele(vehicule.getModele());
                    existing.setMarque(vehicule.getMarque());
                    existing.setAnnee(vehicule.getAnnee());
                    existing.setCouleur(vehicule.getCouleur());
                    existing.setQteStock(vehicule.getQteStock());
                    existing.setPrixBase(vehicule.getPrixBase());
                    existing.setDateArrivee(vehicule.getDateArrivee());
                    existing.setEstSolde(vehicule.isEstSolde());
                    existing.setKilometrage(vehicule.getKilometrage());
                    existing.setStatus(vehicule.getStatus());
                    existing.setImages(vehicule.getImages());

                    if (existing instanceof AutomobileElectrique autoExist &&
                            vehicule instanceof AutomobileElectrique autoNew) {
                        autoExist.setBatterieKwh(autoNew.getBatterieKwh());
                    }
                    if (existing instanceof ScooterElectrique scooterExist &&
                            vehicule instanceof ScooterElectrique scooterNew) {
                        scooterExist.setBatterieKwh(scooterNew.getBatterieKwh());
                    }
                    if (existing instanceof ScooterEssence scooterExist &&
                            vehicule instanceof ScooterEssence scooterNew) {
                        scooterExist.setInjectionDirecte(scooterNew.isInjectionDirecte());
                    }

                    return vehiculeRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Vehicule not found"));
    }

    // Supprimer un véhicule
    public void delete(Long id) {
        vehiculeRepository.deleteById(id);
    }

    // Recherche par prix
    public List<Vehicule> findAllOrderByPrixAsc() {
        return vehiculeRepository.findAllByOrderByPrixBaseAsc();
    }

    public List<Vehicule> findAllOrderByPrixDesc() {
        return vehiculeRepository.findAllByOrderByPrixBaseDesc();
    }

    // Recherche des véhicules soldés
    public List<Vehicule> findByEstSoldeTrue() {
        return vehiculeRepository.findByEstSoldeTrue();
    }

    // Recherche par année
    public List<Vehicule> findByAnnee(int annee) {
        return vehiculeRepository.findByAnnee(annee);
    }

    // Vérifier et mettre à jour le statut soldé d’un véhicule
    public void verifierEtMettreAJourSolde(Vehicule vehicule) {
        if (vehicule.getDateArrivee() != null) {
            long moisEcoules = ChronoUnit.MONTHS.between(vehicule.getDateArrivee(), LocalDate.now());
            if (moisEcoules >= 3) {
                vehicule.setEstSolde(true);
                vehiculeRepository.save(vehicule);
            }
        }
    }

    // Mettre à jour tous les véhicules soldés
    public void mettreAJourVehiculesSoldees() {
        List<Vehicule> vehicules = vehiculeRepository.findAll();
        for (Vehicule v : vehicules) {
            verifierEtMettreAJourSolde(v);
        }
    }

    // Recherche par modèle
    public List<Vehicule> findByModele(String modele) {
        return vehiculeRepository.findByModeleContainingIgnoreCase(modele);
    }

    // Recherche par marque
    public List<Vehicule> findByMarque(String marque) {
        return vehiculeRepository.findByMarqueContainingIgnoreCase(marque);
    }

    // Recherche par mots-clés avec opérateurs logiques
    public List<Vehicule> searchByKeywords(String query) {
        if (query == null || query.trim().isEmpty()) {
            return vehiculeRepository.findAll();
        }

        String cleanQuery = query.trim();

        // Gestion du ET
        if (cleanQuery.toUpperCase().contains(" AND ")) {
            String[] parts = cleanQuery.split("(?i)\\s+AND\\s+");
            if (parts.length >= 2) {
                String left = parts[0].trim();
                String right = parts[1].trim();

                // Exemple: "marque:Toyota AND modele:Corolla"
                if (left.toLowerCase().startsWith("marque:") && right.toLowerCase().startsWith("modele:")) {
                    return vehiculeRepository.findByMarqueContainingIgnoreCaseAndModeleContainingIgnoreCase(
                            left.split(":")[1].trim(),
                            right.split(":")[1].trim());
                }
                if (left.toLowerCase().startsWith("modele:") && right.toLowerCase().startsWith("couleur:")) {
                    return vehiculeRepository.findByModeleContainingIgnoreCaseAndCouleurContainingIgnoreCase(
                            left.split(":")[1].trim(),
                            right.split(":")[1].trim());
                }
                if (left.toLowerCase().startsWith("annee:") && right.toLowerCase().startsWith("marque:")) {
                    return vehiculeRepository.findByAnneeAndMarqueContainingIgnoreCase(
                            Integer.parseInt(left.split(":")[1].trim()),
                            right.split(":")[1].trim());
                }
                if (left.toLowerCase().startsWith("marque:") && right.toLowerCase().startsWith("couleur:")) {
                    return vehiculeRepository.findByMarqueContainingIgnoreCaseAndCouleurContainingIgnoreCase(
                            left.split(":")[1].trim(),
                            right.split(":")[1].trim());
                }
                // fallback par défaut
                return vehiculeRepository.findByModeleContainingIgnoreCaseAndCouleurContainingIgnoreCase(left, right);
            }
        }

        // Gestion du OU
        if (cleanQuery.toUpperCase().contains(" OR ")) {
            String[] parts = cleanQuery.split("(?i)\\s+OR\\s+");
            if (parts.length >= 2) {
                String left = parts[0].trim();
                String right = parts[1].trim();

                if (left.toLowerCase().startsWith("marque:") && right.toLowerCase().startsWith("modele:")) {
                    return vehiculeRepository.findByMarqueContainingIgnoreCaseOrModeleContainingIgnoreCase(
                            left.split(":")[1].trim(),
                            right.split(":")[1].trim());
                }
                if (left.toLowerCase().startsWith("modele:") && right.toLowerCase().startsWith("couleur:")) {
                    return vehiculeRepository.findByModeleContainingIgnoreCaseOrCouleurContainingIgnoreCase(
                            left.split(":")[1].trim(),
                            right.split(":")[1].trim());
                }
                if (left.toLowerCase().startsWith("annee:") && right.toLowerCase().startsWith("marque:")) {
                    return vehiculeRepository.findByAnneeOrMarqueContainingIgnoreCase(
                            Integer.parseInt(left.split(":")[1].trim()),
                            right.split(":")[1].trim());
                }
                if (left.toLowerCase().startsWith("marque:") && right.toLowerCase().startsWith("couleur:")) {
                    return vehiculeRepository.findByMarqueContainingIgnoreCaseAndCouleurContainingIgnoreCase(
                            left.split(":")[1].trim(),
                            right.split(":")[1].trim());
                }
                // fallback par défaut
                return vehiculeRepository.findByMarqueContainingIgnoreCaseOrCouleurContainingIgnoreCase(left, right);
            }
        }

        // Recherche simple par défaut
        return vehiculeRepository.findByModeleContainingIgnoreCase(cleanQuery);
    }

}
