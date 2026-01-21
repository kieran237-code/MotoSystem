package com.designpattern.webmotosystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String type;     // "Bearer"
    private long expiresIn;  // en secondes
}
