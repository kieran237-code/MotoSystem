package com.designpattern.webmotosystem.Entities.Vehicule;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class Automobile extends Vehicule {
    protected int nombrePortes;

    public int getNombrePortes() {
        return nombrePortes;
    }

    public void setNombrePortes(int nombrePortes) {
        this.nombrePortes = nombrePortes;
    }
}
