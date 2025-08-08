package com.provider.registration.service;

import com.provider.registration.dto.ProviderLoginRequest;
import com.provider.registration.dto.ProviderLoginResponse;
import com.provider.registration.model.ClinicAddress;
import com.provider.registration.model.Provider;
import com.provider.registration.model.VerificationStatus;
import com.provider.registration.repository.ProviderRepository;
import com.provider.registration.security.JwtTokenUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @InjectMocks
    private AuthenticationService authenticationService;

    private Provider testProvider;
    private ProviderLoginRequest validLoginRequest;
    private ProviderLoginRequest invalidLoginRequest;

    @BeforeEach
    void setUp() {
        UUID providerId = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();
        
        ClinicAddress address = new ClinicAddress("123 Main St", "New York", "NY", "10001");
        
        testProvider = new Provider();
        testProvider.setId(providerId);
        testProvider.setFirstName("John");
        testProvider.setLastName("Doe");
        testProvider.setEmail("john.doe@example.com");
        testProvider.setPhoneNumber("+1234567890");
        testProvider.setPasswordHash("hashedPassword");
        testProvider.setSpecialization("Cardiology");
        testProvider.setLicenseNumber("LIC123456");
        testProvider.setYearsOfExperience(10);
        testProvider.setClinicAddress(address);
        testProvider.setVerificationStatus(VerificationStatus.PENDING);
        testProvider.setActive(true);
        testProvider.setCreatedAt(now);
        testProvider.setUpdatedAt(now);

        validLoginRequest = new ProviderLoginRequest("john.doe@example.com", "StrongPass123!");
        invalidLoginRequest = new ProviderLoginRequest("nonexistent@example.com", "WrongPassword");
    }

    @Test
    void login_WithValidCredentials_ShouldReturnSuccessResponse() {
        // Arrange
        when(providerRepository.findByEmail("john.doe@example.com"))
                .thenReturn(Optional.of(testProvider));
        when(passwordEncoder.matches("StrongPass123!", "hashedPassword"))
                .thenReturn(true);
        when(jwtTokenUtil.generateToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("jwt-token-here");
        when(jwtTokenUtil.getExpirationTime()).thenReturn(3600L);

        // Act
        ProviderLoginResponse response = authenticationService.login(validLoginRequest);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertNotNull(response.getData());
        assertEquals("jwt-token-here", response.getData().getAccess_token());
        assertEquals(3600L, response.getData().getExpires_in());
        assertEquals("Bearer", response.getData().getToken_type());
        
        ProviderLoginResponse.ProviderData providerData = response.getData().getProvider();
        assertEquals(testProvider.getId(), providerData.getId());
        assertEquals(testProvider.getFirstName(), providerData.getFirstName());
        assertEquals(testProvider.getLastName(), providerData.getLastName());
        assertEquals(testProvider.getEmail(), providerData.getEmail());
        assertEquals(testProvider.getSpecialization(), providerData.getSpecialization());
        assertEquals(testProvider.getVerificationStatus(), providerData.getVerificationStatus());
        assertEquals(testProvider.isActive(), providerData.isActive());
        assertEquals(testProvider.getCreatedAt(), providerData.getCreatedAt());
    }

    @Test
    void login_WithInvalidEmail_ShouldThrowAuthenticationException() {
        // Arrange
        when(providerRepository.findByEmail("nonexistent@example.com"))
                .thenReturn(Optional.empty());

        // Act & Assert
        AuthenticationService.AuthenticationException exception = assertThrows(
                AuthenticationService.AuthenticationException.class,
                () -> authenticationService.login(invalidLoginRequest)
        );
        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void login_WithInvalidPassword_ShouldThrowAuthenticationException() {
        // Arrange
        when(providerRepository.findByEmail("john.doe@example.com"))
                .thenReturn(Optional.of(testProvider));
        when(passwordEncoder.matches("WrongPassword", "hashedPassword"))
                .thenReturn(false);

        // Act & Assert
        AuthenticationService.AuthenticationException exception = assertThrows(
                AuthenticationService.AuthenticationException.class,
                () -> authenticationService.login(new ProviderLoginRequest("john.doe@example.com", "WrongPassword"))
        );
        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void login_WithInactiveAccount_ShouldThrowAuthenticationException() {
        // Arrange
        testProvider.setActive(false);
        when(providerRepository.findByEmail("john.doe@example.com"))
                .thenReturn(Optional.of(testProvider));

        // Act & Assert
        AuthenticationService.AuthenticationException exception = assertThrows(
                AuthenticationService.AuthenticationException.class,
                () -> authenticationService.login(validLoginRequest)
        );
        assertEquals("Account is inactive. Please contact support.", exception.getMessage());
    }

    @Test
    void login_WithEmailCaseInsensitive_ShouldWork() {
        // Arrange
        when(providerRepository.findByEmail("john.doe@example.com"))
                .thenReturn(Optional.of(testProvider));
        when(passwordEncoder.matches("StrongPass123!", "hashedPassword"))
                .thenReturn(true);
        when(jwtTokenUtil.generateToken(any(UUID.class), anyString(), anyString()))
                .thenReturn("jwt-token-here");
        when(jwtTokenUtil.getExpirationTime()).thenReturn(3600L);

        ProviderLoginRequest uppercaseEmailRequest = new ProviderLoginRequest("JOHN.DOE@EXAMPLE.COM", "StrongPass123!");

        // Act
        ProviderLoginResponse response = authenticationService.login(uppercaseEmailRequest);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
    }
} 