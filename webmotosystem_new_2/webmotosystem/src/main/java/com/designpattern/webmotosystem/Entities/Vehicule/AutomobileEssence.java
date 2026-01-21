package com.designpattern.webmotosystem.Entities.Vehicule;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class AutomobileEssence extends Automobile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Override
    public String getType() { return "Automobile"; }

    @Override
    public String getEnergie() { return "Essence"; }

}
