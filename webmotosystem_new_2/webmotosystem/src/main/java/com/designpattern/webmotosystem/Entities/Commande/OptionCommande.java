package com.designpattern.webmotosystem.Entities.Commande;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OptionCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;
    
    @Column(nullable = false)
    private String code; // ex: SIEGES_CUIR
    
    @Column(nullable = false)
    private String nom; // ex: Sièges en cuir
    
    @Column(nullable = false)
    private double prix;
}