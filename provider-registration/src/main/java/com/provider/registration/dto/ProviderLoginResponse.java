package com.provider.registration.dto;

import com.provider.registration.model.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderLoginResponse {
    
    private boolean success;
    private String message;
    private LoginData data;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginData {
        private String access_token;
        private Long expires_in;
        private String token_type;
        private ProviderData provider;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProviderData {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
        private String specialization;
        private VerificationStatus verificationStatus;
        private boolean isActive;
        private LocalDateTime createdAt;
    }
} 