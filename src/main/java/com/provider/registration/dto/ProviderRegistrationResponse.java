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
public class ProviderRegistrationResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String specialization;
    private VerificationStatus verificationStatus;
    private LocalDateTime createdAt;
    private String message;
} 