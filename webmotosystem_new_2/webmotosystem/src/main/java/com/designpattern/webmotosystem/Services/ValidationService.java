package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Entities.Validation;
import com.designpattern.webmotosystem.Repositories.ValidationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
@AllArgsConstructor
public class ValidationService {
    private final ValidationRepository validationRepository;
    private final NotificationService notificationService;

    public void enregister(Utilisateur utilisateur){
        // On récupère la validation existante ou on crée une nouvelle
        Validation validation = validationRepository.findByUtilisateur(utilisateur)
                .orElse(new Validation());

        validation.setUtilisateur(utilisateur);
        Instant creation = Instant.now();
        validation.setCreation(creation);
        validation.setExpiration(creation.plus(10, ChronoUnit.MINUTES));

        // Génération d’un nouveau code à 6 chiffres
        Random random = new Random();
        int randomInteger = random.nextInt(1_000_000);
        String code = String.format("%06d", randomInteger);

        validation.setCode(code);
        validation.setActivation(null); // reset si besoin

        validationRepository.save(validation);

        // Envoi du mail avec le nouveau code
        notificationService.notifierValidation(validation);
    }

    public Validation lireEnFonctionDuCode(String code){
        return validationRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Votre code est invalide"));
    }

    public void updateValidation(Validation validation) {
        validationRepository.save(validation);
    }
}
