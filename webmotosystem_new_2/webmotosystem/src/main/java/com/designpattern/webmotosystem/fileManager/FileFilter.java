package com.designpattern.webmotosystem.fileManager;

import com.designpattern.webmotosystem.exception.UnsupportedFileTypeException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class FileFilter {

    private static final Map<String, String> SUPPORTED_TYPES = new HashMap<>();

    static {
        SUPPORTED_TYPES.put("jpeg", "image/jpeg");
        SUPPORTED_TYPES.put("jpg", "image/jpeg");
        SUPPORTED_TYPES.put("png", "image/png");
        SUPPORTED_TYPES.put("gif", "image/gif");
        SUPPORTED_TYPES.put("webp", "image/webp");
        SUPPORTED_TYPES.put("pdf", "application/pdf");
        SUPPORTED_TYPES.put("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    public String determineContentType(String filePath) throws UnsupportedFileTypeException {
        String extension = FilenameUtils.getExtension(filePath).toLowerCase();
        String contentType = SUPPORTED_TYPES.get(extension);

        if (contentType == null) {
            throw new UnsupportedFileTypeException("Type de fichier non pris en charge : " + extension);
        }
        return contentType;
    }
}
