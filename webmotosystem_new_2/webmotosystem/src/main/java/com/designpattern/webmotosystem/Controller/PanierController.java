// src/main/java/com/designpattern/webmotosystem/Controller/PanierController.java
package com.designpattern.webmotosystem.Controller;

import com.designpattern.webmotosystem.DTO.panier.PanierResponse;
import com.designpattern.webmotosystem.Mappers.PanierMapper;
import com.designpattern.webmotosystem.Entities.panier.Panier;
import com.designpattern.webmotosystem.Services.PanierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/panier")
public class PanierController {

    private final PanierService panierService;

    public PanierController(PanierService panierService) {
        this.panierService = panierService;
    }

    @GetMapping("/{utilisateurId}")
    public ResponseEntity<PanierResponse> getPanier(@PathVariable int utilisateurId) {
        Panier p = panierService.getOrCreatePanier(utilisateurId);
        return ResponseEntity.ok(PanierMapper.toDto(p));
    }

    @PostMapping("/{utilisateurId}/articles/{vehiculeId}")
    public ResponseEntity<PanierResponse> ajouterVehicule(@PathVariable int utilisateurId,
                                                          @PathVariable Long vehiculeId) {
        Panier p = panierService.ajouterVehicule(utilisateurId, vehiculeId);
        return ResponseEntity.ok(PanierMapper.toDto(p));
    }

    @DeleteMapping("/{utilisateurId}/articles/{articleId}")
    public ResponseEntity<PanierResponse> retirerArticle(@PathVariable int utilisateurId,
                                                         @PathVariable Long articleId) {
        Panier p = panierService.retirerArticle(utilisateurId, articleId);
        return ResponseEntity.ok(PanierMapper.toDto(p));
    }

    @PostMapping("/{utilisateurId}/articles/{articleId}/options/{optionCode}")
    public ResponseEntity<PanierResponse> ajouterOption(@PathVariable int utilisateurId,
                                                        @PathVariable Long articleId,
                                                        @PathVariable String optionCode) {
        Panier p = panierService.ajouterOption(utilisateurId, articleId, optionCode);
        return ResponseEntity.ok(PanierMapper.toDto(p));
    }

    @DeleteMapping("/{utilisateurId}/options/{optionChoisieId}")
    public ResponseEntity<PanierResponse> retirerOption(@PathVariable int utilisateurId,
                                                        @PathVariable Long optionChoisieId) {
        Panier p = panierService.retirerOption(utilisateurId, optionChoisieId);
        return ResponseEntity.ok(PanierMapper.toDto(p));
    }

    @PostMapping("/{utilisateurId}/undo")
    public ResponseEntity<PanierResponse> undo(@PathVariable int utilisateurId) {
        Panier p = panierService.undo(utilisateurId);
        return ResponseEntity.ok(PanierMapper.toDto(p));
    }

    @PostMapping("/{utilisateurId}/redo")
    public ResponseEntity<PanierResponse> redo(@PathVariable int utilisateurId) {
        Panier p = panierService.redo(utilisateurId);
        return ResponseEntity.ok(PanierMapper.toDto(p));
    }
}
