package com.designpattern.webmotosystem.Services;

import com.designpattern.webmotosystem.exception.UnsupportedFileTypeException;
import com.designpattern.webmotosystem.fileManager.FileFilter;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir;
    private final FileFilter fileFilter;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir, FileFilter fileFilter) {
        this.uploadDir = uploadDir;
        this.fileFilter = fileFilter;
    }

    /**
     * Stocke un fichier sur disque et retourne son nom généré
     */
    public String storeFile(MultipartFile file) throws IOException, UnsupportedFileTypeException {
        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new IOException("Nom de fichier invalide");
        }

        String extension = FilenameUtils.getExtension(originalName).toLowerCase();

        // Vérifie si le type est supporté
        fileFilter.determineContentType(originalName);

        // Génère un nom unique pour éviter les collisions
        String newName = UUID.randomUUID() + "." + extension;

        Path targetPath = Paths.get(uploadDir).resolve(newName).normalize();
        Files.createDirectories(targetPath.getParent());
        Files.write(targetPath, file.getBytes());

        return newName;
    }

    /**
     * Charge un fichier depuis le disque
     */
    public byte[] loadFile(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        return Files.readAllBytes(filePath);
    }
}
