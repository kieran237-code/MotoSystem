package com.designpattern.webmotosystem.Controller;

import com.designpattern.webmotosystem.Entities.Vehicule.*;
import com.designpattern.webmotosystem.Services.VehiculeService;
import com.designpattern.webmotosystem.Services.FileStorageService;
import com.designpattern.webmotosystem.exception.UnsupportedFileTypeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/vehicules")
@CrossOrigin(origins = "*")
public class VehiculeController {

    private final VehiculeService vehiculeService;
    private final FileStorageService fileStorageService;

    public VehiculeController(VehiculeService vehiculeService, FileStorageService fileStorageService) {
        this.vehiculeService = vehiculeService;
        this.fileStorageService = fileStorageService;
    }

    // -------------------- POST --------------------

    @PostMapping(value = "/automobile/electrique", consumes = {"multipart/form-data"})
    public ResponseEntity<Vehicule> createAutoElectrique(
            @RequestParam String reference,
            @RequestParam String modele,
            @RequestParam String marque,
            @RequestParam int annee,
            @RequestParam String couleur,
            @RequestParam int qteStock,
            @RequestParam double prixBase,
            @RequestParam String dateArrivee,
            @RequestParam boolean estSolde,
            @RequestParam double kilometrage,
            @RequestParam StatusVehicule status,
            @RequestParam double batterieKwh,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException, UnsupportedFileTypeException {

        AutomobileElectrique auto = new AutomobileElectrique();
        auto.setReference(reference);
        auto.setModele(modele);
        auto.setMarque(marque);
        auto.setAnnee(annee);
        auto.setCouleur(couleur);
        auto.setQteStock(qteStock);
        auto.setPrixBase(prixBase);
        auto.setDateArrivee(LocalDate.parse(dateArrivee));
        auto.setEstSolde(estSolde);
        auto.setKilometrage(kilometrage);
        auto.setStatus(status);
        auto.setBatterieKwh(batterieKwh);
        auto.setImages(storeImages(images));

        return ResponseEntity.ok(vehiculeService.save(auto));
    }

    @PostMapping(value = "/automobile/essence", consumes = {"multipart/form-data"})
    public ResponseEntity<Vehicule> createAutoEssence(
            @RequestParam String reference,
            @RequestParam String modele,
            @RequestParam String marque,
            @RequestParam int annee,
            @RequestParam String couleur,
            @RequestParam int qteStock,
            @RequestParam double prixBase,
            @RequestParam String dateArrivee,
            @RequestParam boolean estSolde,
            @RequestParam double kilometrage,
            @RequestParam StatusVehicule status,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException, UnsupportedFileTypeException {

        AutomobileEssence auto = new AutomobileEssence();
        auto.setReference(reference);
        auto.setModele(modele);
        auto.setMarque(marque);
        auto.setAnnee(annee);
        auto.setCouleur(couleur);
        auto.setQteStock(qteStock);
        auto.setPrixBase(prixBase);
        auto.setDateArrivee(LocalDate.parse(dateArrivee));
        auto.setEstSolde(estSolde);
        auto.setKilometrage(kilometrage);
        auto.setStatus(status);
        auto.setImages(storeImages(images));

        return ResponseEntity.ok(vehiculeService.save(auto));
    }

    @PostMapping(value = "/scooter/electrique", consumes = {"multipart/form-data"})
    public ResponseEntity<Vehicule> createScooterElectrique(
            @RequestParam String reference,
            @RequestParam String modele,
            @RequestParam String marque,
            @RequestParam int annee,
            @RequestParam String couleur,
            @RequestParam int qteStock,
            @RequestParam double prixBase,
            @RequestParam String dateArrivee,
            @RequestParam boolean estSolde,
            @RequestParam double kilometrage,
            @RequestParam StatusVehicule status,
            @RequestParam double batterieKwh,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException, UnsupportedFileTypeException {

        ScooterElectrique scooter = new ScooterElectrique();
        scooter.setReference(reference);
        scooter.setModele(modele);
        scooter.setMarque(marque);
        scooter.setAnnee(annee);
        scooter.setCouleur(couleur);
        scooter.setQteStock(qteStock);
        scooter.setPrixBase(prixBase);
        scooter.setDateArrivee(LocalDate.parse(dateArrivee));
        scooter.setEstSolde(estSolde);
        scooter.setKilometrage(kilometrage);
        scooter.setStatus(status);
        scooter.setBatterieKwh(batterieKwh);
        scooter.setImages(storeImages(images));

        return ResponseEntity.ok(vehiculeService.save(scooter));
    }

    @PostMapping(value = "/scooter/essence", consumes = {"multipart/form-data"})
    public ResponseEntity<Vehicule> createScooterEssence(
            @RequestParam String reference,
            @RequestParam String modele,
            @RequestParam String marque,
            @RequestParam int annee,
            @RequestParam String couleur,
            @RequestParam int qteStock,
            @RequestParam double prixBase,
            @RequestParam String dateArrivee,
            @RequestParam boolean estSolde,
            @RequestParam double kilometrage,
            @RequestParam StatusVehicule status,
            @RequestParam boolean injectionDirecte,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException, UnsupportedFileTypeException {

        ScooterEssence scooter = new ScooterEssence();
        scooter.setReference(reference);
        scooter.setModele(modele);
        scooter.setMarque(marque);
        scooter.setAnnee(annee);
        scooter.setCouleur(couleur);
        scooter.setQteStock(qteStock);
        scooter.setPrixBase(prixBase);
        scooter.setDateArrivee(LocalDate.parse(dateArrivee));
        scooter.setEstSolde(estSolde);
        scooter.setKilometrage(kilometrage);
        scooter.setStatus(status);
        scooter.setInjectionDirecte(injectionDirecte);
        scooter.setImages(storeImages(images));

        return ResponseEntity.ok(vehiculeService.save(scooter));
    }

    // -------------------- GET --------------------

    @GetMapping
    public List<Vehicule> getAllVehicules() {
        return vehiculeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicule> getVehiculeById(@PathVariable Long id) {
        return vehiculeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------- PUT --------------------

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Vehicule> updateVehicule(
            @PathVariable Long id,
            @RequestParam String modele,
            @RequestParam String marque,
            @RequestParam int annee,
            @RequestParam double prixBase,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException, UnsupportedFileTypeException {

        Vehicule vehicule = vehiculeService.findById(id).orElse(null);
        if (vehicule == null) {
            return ResponseEntity.notFound().build();
        }

        vehicule.setModele(modele);
        vehicule.setMarque(marque);
        vehicule.setAnnee(annee);
        vehicule.setPrixBase(prixBase);
        vehicule.setImages(storeImages(images));

        Vehicule updated = vehiculeService.update(id, vehicule);
        return ResponseEntity.ok(updated);
    }

    // -------------------- DELETE --------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        vehiculeService.delete(id);
        return ResponseEntity.noContent().build();
    }



    private List<String> storeImages(List<MultipartFile> images) throws IOException, UnsupportedFileTypeException {
        List<String> imageNames = new ArrayList<>();
        if (images != null) {
            for (MultipartFile img : images) {
                imageNames.add(fileStorageService.storeFile(img));
            }
        }
        return imageNames;
    }

    @GetMapping("/search/prix")
    public List<Vehicule> searchByPrix(@RequestParam(defaultValue = "asc") String order) {
        if ("desc".equalsIgnoreCase(order)) {
            return vehiculeService.findAllOrderByPrixDesc();
        }
        return vehiculeService.findAllOrderByPrixAsc();
    }
    // -------------------- RECHERCHE PAR VEHICULES SOLDEES --------------------

    @GetMapping("/search/soldees")
    public List<Vehicule> searchVehiculesSoldees() {
        return vehiculeService.findByEstSoldeTrue();
    }

// -------------------- RECHERCHE PAR ANNEE --------------------

    @GetMapping("/search/annee")
    public List<Vehicule> searchByAnnee(@RequestParam int annee) {
        return vehiculeService.findByAnnee(annee);
    }
    // -------------------- MISE A JOUR VEHICULES SOLDEES --------------------

    @PutMapping("/update-soldees")
    public ResponseEntity<Void> updateVehiculesSoldees() {
        vehiculeService.mettreAJourVehiculesSoldees();
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/search/modele")
    public List<Vehicule> searchByModele(@RequestParam String modele) {
        return vehiculeService.findByModele(modele);
    }

    @GetMapping("/search/marque")
    public List<Vehicule> searchByMarque(@RequestParam String marque) {
        return vehiculeService.findByMarque(marque);
    }


    @GetMapping("/search/keywords")
    public List<Vehicule> searchByKeywords(@RequestParam String query) {
        return vehiculeService.searchByKeywords(query);
    }

}
