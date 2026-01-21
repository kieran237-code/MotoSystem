package com.designpattern.webmotosystem.factory;

import com.designpattern.webmotosystem.Entities.Vehicule.Automobile;
import com.designpattern.webmotosystem.Entities.Vehicule.Scooter;

public abstract class FabriqueVehicule {
    public abstract Automobile creerAutomobile(String modele);
    public abstract Scooter creerScooter(String modele);
}
