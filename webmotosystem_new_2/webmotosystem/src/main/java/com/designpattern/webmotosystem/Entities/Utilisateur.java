package com.designpattern.webmotosystem.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Utilisateur implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String email;

    @Embedded
    private Adresse adresse;

    private boolean actif = false;

    private LocalDateTime dateInscription;
    @PrePersist
    protected void onCreate() {
        this.dateInscription = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Role role;


    // Champs specifiques aux societes
    @Column(nullable = true) private String raisonSociale;

    @Column(nullable = true) private String numeroRegistreCommerce;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    // Toujours true sauf isEnabled()
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return this.actif; }

    // Getters / Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public void setPassword(String password) { this.password = password; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Adresse getAdresse() {
        return adresse;
    }

    public void setAdresse(Adresse adresse) {
        this.adresse = adresse;
    }

    public LocalDateTime getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(LocalDateTime dateInscription) {
        this.dateInscription = dateInscription;
    }

    public String getRaisonSociale() {
        return raisonSociale;
    }

    public void setRaisonSociale(String raisonSociale) {
        this.raisonSociale = raisonSociale;
    }

    public String getNumeroRegistreCommerce() {
        return numeroRegistreCommerce;
    }

    public void setNumeroRegistreCommerce(String numeroRegistreCommerce) {
        this.numeroRegistreCommerce = numeroRegistreCommerce;
    }
}
