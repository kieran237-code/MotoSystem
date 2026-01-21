package com.designpattern.webmotosystem.Controller;

/**
 * Controller REST pour exposer les routes sur les utilisateurs.
 */
import com.designpattern.webmotosystem.Entities.Role;
import com.designpattern.webmotosystem.Entities.Utilisateur;
import com.designpattern.webmotosystem.Security.JwtService;
import com.designpattern.webmotosystem.Services.UtilisateurService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import com.designpattern.webmotosystem.DTO.LoginRequest;
import com.designpattern.webmotosystem.DTO.LoginResponse;
import com.designpattern.webmotosystem.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
// @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
public class UtilisateurController {

    private final UtilisateurService utilisateurService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping(path = "/inscription")
    public void inscription(@RequestBody Utilisateur utilisateur) {
        log.info("Inscription utilisateur {}", utilisateur.getEmail());
        utilisateurService.inscription(utilisateur);
    }

    @PostMapping(path = "/activation")
    public void activation(@RequestBody Map<String, String> activation) {
        utilisateurService.activation(activation);
    }

    // Nouveau endpoint pour redemander un code
    @PostMapping(path = "/resend-activation")
    public void resendActivation(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        log.info("Resend activation for {}", email);
        utilisateurService.resendActivation(email);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Utilisateur utilisateur = utilisateurService.getUserByEmail(request.getEmail());
        String token = jwtService.generateToken(utilisateur.getId(), utilisateur.getEmail(),
                utilisateur.getRole().name());

        return new LoginResponse(token, "Bearer", jwtService.getExpirationSeconds());
    }

    @GetMapping("/{id}")
    public Utilisateur getUserById(@PathVariable int id) {
        return utilisateurService.getUserById(id);
    }

    @GetMapping("/email/{email}")
    public Utilisateur getUserByEmail(@PathVariable String email) {
        return utilisateurService.getUserByEmail(email);
    }

    @GetMapping
    public List<Utilisateur> getAllUsers() {
        return utilisateurService.getAllUsers();
    }

    @GetMapping("/searchByRole/{role}")
    public List<Utilisateur> getUsersByRole(@PathVariable Role role) {
        return utilisateurService.getUsersByRole(role);
    }
}
