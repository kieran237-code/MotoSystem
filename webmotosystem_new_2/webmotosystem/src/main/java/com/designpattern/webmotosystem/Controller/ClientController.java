package com.designpattern.webmotosystem.Controller;

import com.designpattern.webmotosystem.Entities.client.ClientEntreprise;
import com.designpattern.webmotosystem.Services.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST pour exposer les societes et leurs filiales.
 */
@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping(path = "/clients", produces = MediaType.APPLICATION_JSON_VALUE)
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/societe/{id}")
    public ClientEntreprise getSocieteAvecFiliales(@PathVariable int id) {
        return clientService.construireSocieteAvecFiliales(id);
    }
}
