package com.provider.registration.service;

import com.provider.registration.dto.ClinicAddressDto;
import com.provider.registration.dto.ProviderRegistrationRequest;
import com.provider.registration.dto.ProviderRegistrationResponse;
import com.provider.registration.model.ClinicAddress;
import com.provider.registration.model.Provider;
import com.provider.registration.model.VerificationStatus;
import com.provider.registration.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;

    public ProviderRegistrationResponse registerProvider(ProviderRegistrationRequest request) {
        log.info("Processing provider registration for email: {}", request.getEmail());

        // Check for duplicate email
        if (providerRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists: {}", request.getEmail());
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        // Check for duplicate phone number
        if (providerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            log.warn("Registration failed: Phone number already exists: {}", request.getPhoneNumber());
            throw new DuplicateResourceException("Phone number already registered: " + request.getPhoneNumber());
        }

        // Check for duplicate license number
        if (providerRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            log.warn("Registration failed: License number already exists: {}", request.getLicenseNumber());
            throw new DuplicateResourceException("License number already registered: " + request.getLicenseNumber());
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Convert DTO to entity
        Provider provider = new Provider();
        provider.setFirstName(request.getFirstName().trim());
        provider.setLastName(request.getLastName().trim());
        provider.setEmail(request.getEmail().trim().toLowerCase());
        provider.setPhoneNumber(request.getPhoneNumber().trim());
        provider.setPasswordHash(hashedPassword);
        provider.setSpecialization(request.getSpecialization().trim());
        provider.setLicenseNumber(request.getLicenseNumber().trim().toUpperCase());
        provider.setYearsOfExperience(request.getYearsOfExperience());
        provider.setVerificationStatus(VerificationStatus.PENDING);
        provider.setActive(true);

        // Convert clinic address
        if (request.getClinicAddress() != null) {
            ClinicAddressDto addressDto = request.getClinicAddress();
            ClinicAddress address = new ClinicAddress();
            address.setStreet(addressDto.getStreet().trim());
            address.setCity(addressDto.getCity().trim());
            address.setState(addressDto.getState().trim());
            address.setZip(addressDto.getZip().trim());
            provider.setClinicAddress(address);
        }

        // Save the provider
        Provider savedProvider = providerRepository.save(provider);
        log.info("Provider registered successfully with ID: {}", savedProvider.getId());

        // Create response
        return new ProviderRegistrationResponse(
                savedProvider.getId(),
                savedProvider.getFirstName(),
                savedProvider.getLastName(),
                savedProvider.getEmail(),
                savedProvider.getSpecialization(),
                savedProvider.getVerificationStatus(),
                savedProvider.getCreatedAt(),
                "Provider registered successfully. Verification status: PENDING"
        );
    }

    public static class DuplicateResourceException extends RuntimeException {
        public DuplicateResourceException(String message) {
            super(message);
        }
    }
}
