package com.designpattern.webmotosystem.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    private Key SECRET_KEY;

    @PostConstruct
    public void init() {

        SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
    }

    private final long EXP_MS = 1000 * 60 * 60 * 24; // 1h

 public String generateToken(int id,String email, String role) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(email)
                .claim("id", id)
                .claim("role", role) 
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + EXP_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public long getExpirationSeconds() {
        return EXP_MS / 1000;
    }
}
