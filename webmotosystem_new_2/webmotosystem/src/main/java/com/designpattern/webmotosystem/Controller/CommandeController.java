package com.designpattern.webmotosystem.Controller;

import com.designpattern.webmotosystem.DTO.CommandeResponse;
import com.designpattern.webmotosystem.Entities.Commande.Commande;
import com.designpattern.webmotosystem.Entities.Commande.EnumCommande;
import com.designpattern.webmotosystem.Mappers.CommandeMapper;
import com.designpattern.webmotosystem.Services.CommandeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/commandes")
@AllArgsConstructor
public class CommandeController {

    private final CommandeService commandeService;

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CommandeResponse>> getCommandesByClient(@PathVariable int clientId) {
        List<Commande> commandes = commandeService.getCommandesByClientId(clientId);
        List<CommandeResponse> response = commandes.stream()
                .map(CommandeMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CommandeResponse> creerCommande(
            @RequestParam EnumCommande typeCommande,
            @RequestParam int clientId,
            @RequestParam int vendeurId,
            @RequestParam Long vehiculeId,
            @RequestParam String paysLivraison) {

        Commande commande = commandeService.creerCommande(typeCommande, clientId, vendeurId, vehiculeId, paysLivraison);
        return ResponseEntity.ok(CommandeMapper.toDto(commande));
    }

    // 🔑 Nouveau endpoint pour passer une commande depuis le panier
    @PostMapping("/from-panier")
    public ResponseEntity<CommandeResponse> creerCommandeDepuisPanier(
            @RequestParam EnumCommande typeCommande,
            @RequestParam int clientId,
            @RequestParam int vendeurId,
            @RequestParam Long cartItemId,
            @RequestParam String paysLivraison) {

        Commande commande = commandeService.creerCommandeDepuisPanier(typeCommande, clientId, vendeurId, cartItemId, paysLivraison);
        return ResponseEntity.ok(CommandeMapper.toDto(commande));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandeResponse> getCommande(@PathVariable Long id) {
        return commandeService.getCommandeById(id)
                .map(c -> ResponseEntity.ok(CommandeMapper.toDto(c)))
                .orElse(ResponseEntity.notFound().build());
    }
}
