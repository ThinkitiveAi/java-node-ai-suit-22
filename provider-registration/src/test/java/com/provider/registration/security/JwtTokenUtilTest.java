package com.provider.registration.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtTokenUtilTest {

    @InjectMocks
    private JwtTokenUtil jwtTokenUtil;

    private UUID testProviderId;
    private String testEmail;
    private String testSpecialization;

    @BeforeEach
    void setUp() {
        testProviderId = UUID.randomUUID();
        testEmail = "test@example.com";
        testSpecialization = "Cardiology";
        
        // Set required properties
        ReflectionTestUtils.setField(jwtTokenUtil, "secret", "test-secret-key-that-is-long-enough-for-hs512-algorithm-and-must-be-at-least-512-bits-long-for-security-compliance");
        ReflectionTestUtils.setField(jwtTokenUtil, "expiration", 3600L);
        ReflectionTestUtils.setField(jwtTokenUtil, "issuer", "test-issuer");
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        // Act
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(jwtTokenUtil.validateToken(token));
    }

    @Test
    void extractEmail_ShouldReturnCorrectEmail() {
        // Arrange
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Act
        String extractedEmail = jwtTokenUtil.extractEmail(token);

        // Assert
        assertEquals(testEmail, extractedEmail);
    }

    @Test
    void extractProviderId_ShouldReturnCorrectProviderId() {
        // Arrange
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Act
        UUID extractedProviderId = jwtTokenUtil.extractProviderId(token);

        // Assert
        assertEquals(testProviderId, extractedProviderId);
    }

    @Test
    void extractSpecialization_ShouldReturnCorrectSpecialization() {
        // Arrange
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Act
        String extractedSpecialization = jwtTokenUtil.extractSpecialization(token);

        // Assert
        assertEquals(testSpecialization, extractedSpecialization);
    }

    @Test
    void extractAllClaims_ShouldReturnAllClaims() {
        // Arrange
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Act
        Claims claims = jwtTokenUtil.extractAllClaims(token);

        // Assert
        assertNotNull(claims);
        assertEquals(testEmail, claims.getSubject());
        assertEquals(testProviderId.toString(), claims.get("provider_id"));
        assertEquals("PROVIDER", claims.get("role"));
        assertEquals(testSpecialization, claims.get("specialization"));
        assertEquals("test-issuer", claims.getIssuer());
    }

    @Test
    void isTokenExpired_WithValidToken_ShouldReturnFalse() {
        // Arrange
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Act
        boolean isExpired = jwtTokenUtil.isTokenExpired(token);

        // Assert
        assertFalse(isExpired);
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        // Arrange
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Act
        boolean isValid = jwtTokenUtil.validateToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act
        boolean isValid = jwtTokenUtil.validateToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateToken_WithEmptyToken_ShouldReturnFalse() {
        // Arrange
        String emptyToken = "";

        // Act
        boolean isValid = jwtTokenUtil.validateToken(emptyToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateToken_WithNullToken_ShouldReturnFalse() {
        // Act
        boolean isValid = jwtTokenUtil.validateToken(null);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void getExpirationTime_ShouldReturnConfiguredValue() {
        // Act
        Long expirationTime = jwtTokenUtil.getExpirationTime();

        // Assert
        assertEquals(3600L, expirationTime);
    }

    @Test
    void extractExpiration_ShouldReturnFutureDate() {
        // Arrange
        String token = jwtTokenUtil.generateToken(testProviderId, testEmail, testSpecialization);

        // Act
        Date expiration = jwtTokenUtil.extractExpiration(token);

        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }
} 