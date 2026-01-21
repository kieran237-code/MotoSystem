package com.designpattern.webmotosystem.Entities.Vehicule;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "typeVehicule"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = AutomobileElectrique.class, name = "AutomobileElectrique"),
        @JsonSubTypes.Type(value = AutomobileEssence.class, name = "AutomobileEssence"),
        @JsonSubTypes.Type(value = ScooterElectrique.class, name = "ScooterElectrique"),
        @JsonSubTypes.Type(value = ScooterEssence.class, name = "ScooterEssence")
})
public abstract class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    protected String reference;
    protected String modele;
    protected String marque;
    protected int annee;
    protected String couleur;
    protected int qteStock;
    protected double prixBase;
    protected LocalDate dateArrivee;
    protected boolean estSolde;
    protected double kilometrage;

    @Enumerated(EnumType.STRING)
    protected StatusVehicule status;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "vehicule_images", joinColumns = @JoinColumn(name = "vehicule_id"))
    @Column(name = "image_url")
    @Fetch(FetchMode.JOIN)
    private List<String> images;

    public abstract String getType();
    public abstract String getEnergie();

    public double calculerPrix() {
        return estSolde ? prixBase * 0.8 : prixBase;
    }

    public boolean estDisponible() {
        return qteStock > 0;
    }
}
