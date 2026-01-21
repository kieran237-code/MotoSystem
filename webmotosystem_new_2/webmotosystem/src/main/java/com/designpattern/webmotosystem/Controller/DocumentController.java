package com.designpattern.webmotosystem.Controller;

import com.designpattern.webmotosystem.Entities.Commande.Commande;
import com.designpattern.webmotosystem.Entities.documents.adapter.HtmlDocument;
import com.designpattern.webmotosystem.Entities.documents.adapter.PdfAdapter;
import com.designpattern.webmotosystem.Services.CommandeService;
import com.designpattern.webmotosystem.Services.DocumentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final CommandeService commandeService;

    public DocumentController(DocumentService documentService, CommandeService commandeService) {
        this.documentService = documentService;
        this.commandeService = commandeService;
    }

    // ==========================================
    // ROUTES HTML (Pour l'aperçu dans l'iframe)
    // ==========================================

    @GetMapping("/html/demande/download")
    public ResponseEntity<byte[]> getDemandeHTML(@RequestParam Long orderId) throws IOException {
        return generateHtmlResponse("Demande d'immatriculation", orderId);
    }

    @GetMapping("/html/cession/download")
    public ResponseEntity<byte[]> getCessionHTML(@RequestParam Long orderId) throws IOException {
        return generateHtmlResponse("Certificat de cession", orderId);
    }

    @GetMapping("/html/commande/download")
    public ResponseEntity<byte[]> getCommandeHTML(@RequestParam Long orderId) throws IOException {
        return generateHtmlResponse("Bon de commande", orderId);
    }

    // ==========================================
    // ROUTES PDF (Pour le téléchargement)
    // ==========================================

    @GetMapping("/pdf/demande/download")
    public ResponseEntity<byte[]> getDemandePDF(@RequestParam Long orderId) throws IOException {
        return generatePdfResponse("Demande d'immatriculation", "demande_immatriculation.pdf", orderId);
    }

    @GetMapping("/pdf/cession/download")
    public ResponseEntity<byte[]> getCessionPDF(@RequestParam Long orderId) throws IOException {
        return generatePdfResponse("Certificat de cession", "certificat_cession.pdf", orderId);
    }

    @GetMapping("/pdf/commande/download")
    public ResponseEntity<byte[]> getCommandePDF(@RequestParam Long orderId) throws IOException {
        return generatePdfResponse("Bon de commande", "bon_de_commande.pdf", orderId);
    }

    // ==========================================
    // MÉTHODES UTILITAIRES
    // ==========================================

    private ResponseEntity<byte[]> generateHtmlResponse(String titre, Long orderId) throws IOException {
        Commande commande = commandeService.getCommandeById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        HtmlDocument doc = new HtmlDocument(
            titre,
            documentService.getClient(commande.getClient().getId()),
            documentService.getVehicule(commande.getVehicule().getId()),
            documentService.getCommande(commande.getId())
        );
        doc.print(); // Génère document.html

        Path path = Paths.get("document.html");
        byte[] fileBytes = Files.readAllBytes(path);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_TYPE, "text/html; charset=UTF-8")
                .body(fileBytes);
    }

    private ResponseEntity<byte[]> generatePdfResponse(String titre, String filename, Long orderId) throws IOException {
        Commande commande = commandeService.getCommandeById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        PdfAdapter doc = new PdfAdapter(
            titre,
            documentService.getClient(commande.getClient().getId()),
            documentService.getVehicule(commande.getVehicule().getId()),
            documentService.getCommande(commande.getId())
        );
        doc.print(); // Génère document.pdf

        Path path = Paths.get("document.pdf");
        byte[] fileBytes = Files.readAllBytes(path);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(fileBytes);
    }
}
