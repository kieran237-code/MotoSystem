package com.designpattern.webmotosystem.factory;

import com.designpattern.webmotosystem.Entities.Vehicule.*;
import org.springframework.stereotype.Component;

@Component
public class FabriqueVehiculeEssence extends FabriqueVehicule {

    @Override
    public Automobile creerAutomobile(String modele) {
        AutomobileEssence auto = new AutomobileEssence();
        auto.setModele(modele);
        return auto;
    }

    @Override
    public Scooter creerScooter(String modele) {
        ScooterEssence scooter = new ScooterEssence();
        scooter.setModele(modele);
        return scooter;
    }
}
