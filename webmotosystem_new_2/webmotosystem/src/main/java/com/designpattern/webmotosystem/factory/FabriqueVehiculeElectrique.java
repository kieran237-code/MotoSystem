package com.designpattern.webmotosystem.factory;

import com.designpattern.webmotosystem.Entities.Vehicule.*;
import org.springframework.stereotype.Component;

@Component
public class FabriqueVehiculeElectrique extends FabriqueVehicule {

    @Override
    public Automobile creerAutomobile(String modele) {
        AutomobileElectrique auto = new AutomobileElectrique();
        auto.setModele(modele);
        return auto;
    }

    @Override
    public Scooter creerScooter(String modele) {
        ScooterElectrique scooter = new ScooterElectrique();
        scooter.setModele(modele);
        return scooter;
    }
}
