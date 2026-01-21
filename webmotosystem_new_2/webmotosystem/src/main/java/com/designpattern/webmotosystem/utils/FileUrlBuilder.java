package com.designpattern.webmotosystem.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Component
public class FileUrlBuilder {

    public String buildUrl(String filename) {
        if (filename == null || filename.isEmpty()) {
            return null;
        }
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(filename)
                .toUriString();
    }
}
