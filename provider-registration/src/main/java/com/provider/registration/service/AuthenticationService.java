package com.provider.registration.service;

import com.provider.registration.dto.ProviderLoginRequest;
import com.provider.registration.dto.ProviderLoginResponse;
import com.provider.registration.model.Provider;
import com.provider.registration.repository.ProviderRepository;
import com.provider.registration.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public ProviderLoginResponse login(ProviderLoginRequest request) {
        log.info("Processing login request for email: {}", request.getEmail());
        
        // Find provider by email
        Provider provider = providerRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));
        
        // Check if provider is active
        if (!provider.isActive()) {
            log.warn("Login failed: Provider account is inactive for email: {}", request.getEmail());
            throw new AuthenticationException("Account is inactive. Please contact support.");
        }
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), provider.getPasswordHash())) {
            log.warn("Login failed: Invalid password for email: {}", request.getEmail());
            throw new AuthenticationException("Invalid email or password");
        }
        
        // Generate JWT token
        String accessToken = jwtTokenUtil.generateToken(
                provider.getId(), 
                provider.getEmail(), 
                provider.getSpecialization()
        );
        
        log.info("Login successful for provider: {}", provider.getEmail());
        
        // Build response
        ProviderLoginResponse.LoginData loginData = new ProviderLoginResponse.LoginData();
        loginData.setAccess_token(accessToken);
        loginData.setExpires_in(jwtTokenUtil.getExpirationTime());
        loginData.setToken_type("Bearer");
        
        ProviderLoginResponse.ProviderData providerData = new ProviderLoginResponse.ProviderData();
        providerData.setId(provider.getId());
        providerData.setFirstName(provider.getFirstName());
        providerData.setLastName(provider.getLastName());
        providerData.setEmail(provider.getEmail());
        providerData.setSpecialization(provider.getSpecialization());
        providerData.setVerificationStatus(provider.getVerificationStatus());
        providerData.setActive(provider.isActive());
        providerData.setCreatedAt(provider.getCreatedAt());
        
        loginData.setProvider(providerData);
        
        return new ProviderLoginResponse(true, "Login successful", loginData);
    }
    
    public static class AuthenticationException extends RuntimeException {
        public AuthenticationException(String message) {
            super(message);
        }
    }
} 