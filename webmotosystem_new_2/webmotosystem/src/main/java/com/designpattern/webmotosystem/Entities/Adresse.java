package com.designpattern.webmotosystem.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Adresse{
    @Column(nullable = false)
    private String pays;
    @Column(nullable = false)
    private String ville;
    @Column(nullable = true)
    private String boitePostale;
    @Column(nullable = false)
    private String telephone;

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getBoitePostale() {
        return boitePostale;
    }

    public void setBoitePostale(String boitePostale) {
        this.boitePostale = boitePostale;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}
