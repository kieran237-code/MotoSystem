package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.Entities.Validation;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void notifierValidation(Validation validation) {

        String message = String.format(
                "Notification simulée -> Bonjour %s, votre code d'activation est %s",
                validation.getUtilisateur().getNom(),
                validation.getCode()
        );

        System.out.println(message);
    }
}
