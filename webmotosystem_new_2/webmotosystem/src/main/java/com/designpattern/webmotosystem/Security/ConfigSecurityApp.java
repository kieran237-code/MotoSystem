package com.designpattern.webmotosystem.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class ConfigSecurityApp {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtService jwtService,
                                                   CustomUserDetailsService userDetailsService) throws Exception {
        // ✅ Création du filtre JWT
        JwtAuthenticationFilter jwtAuthFilter = new JwtAuthenticationFilter(jwtService, userDetailsService);

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Endpoints publics
                        .requestMatchers(HttpMethod.POST, "/inscription").permitAll()
                        .requestMatchers(HttpMethod.POST, "/activation").permitAll()
                        .requestMatchers(HttpMethod.POST, "/resend-activation").permitAll()
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/documents/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/panier/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated()
                )
           .headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
        .policyDirectives("frame-ancestors 'self' http://localhost:5173")
    )
)

                .addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,
                                                       BCryptPasswordEncoder encoder,
                                                       CustomUserDetailsService userDetailsService) throws Exception {
        AuthenticationManagerBuilder authManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(encoder);

        return authManagerBuilder.build();
    }
}
