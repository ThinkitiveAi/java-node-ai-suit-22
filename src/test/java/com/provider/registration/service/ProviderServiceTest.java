package com.provider.registration.service;

import com.provider.registration.dto.ClinicAddressDto;
import com.provider.registration.dto.ProviderRegistrationRequest;
import com.provider.registration.dto.ProviderRegistrationResponse;
import com.provider.registration.model.ClinicAddress;
import com.provider.registration.model.Provider;
import com.provider.registration.model.VerificationStatus;
import com.provider.registration.repository.ProviderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProviderServiceTest {

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ProviderService providerService;

    private ProviderRegistrationRequest validRequest;
    private Provider savedProvider;

    @BeforeEach
    void setUp() {
        // Setup valid request
        validRequest = new ProviderRegistrationRequest();
        validRequest.setFirstName("John");
        validRequest.setLastName("Doe");
        validRequest.setEmail("john.doe@example.com");
        validRequest.setPhoneNumber("+1234567890");
        validRequest.setPassword("StrongPass123!");
        validRequest.setSpecialization("Cardiology");
        validRequest.setLicenseNumber("LIC123456");
        validRequest.setYearsOfExperience(10);

        ClinicAddressDto addressDto = new ClinicAddressDto();
        addressDto.setStreet("123 Main St");
        addressDto.setCity("New York");
        addressDto.setState("NY");
        addressDto.setZip("10001");
        validRequest.setClinicAddress(addressDto);

        // Setup saved provider
        savedProvider = new Provider();
        savedProvider.setId(UUID.randomUUID());
        savedProvider.setFirstName("John");
        savedProvider.setLastName("Doe");
        savedProvider.setEmail("john.doe@example.com");
        savedProvider.setPhoneNumber("+1234567890");
        savedProvider.setPasswordHash("hashedPassword");
        savedProvider.setSpecialization("Cardiology");
        savedProvider.setLicenseNumber("LIC123456");
        savedProvider.setYearsOfExperience(10);
        savedProvider.setVerificationStatus(VerificationStatus.PENDING);
        savedProvider.setActive(true);
        savedProvider.setCreatedAt(LocalDateTime.now());
        savedProvider.setUpdatedAt(LocalDateTime.now());

        ClinicAddress address = new ClinicAddress();
        address.setStreet("123 Main St");
        address.setCity("New York");
        address.setState("NY");
        address.setZip("10001");
        savedProvider.setClinicAddress(address);
    }

    @Test
    void testRegisterProvider_Success() {
        // Given
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(providerRepository.existsByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(false);
        when(providerRepository.existsByLicenseNumber(validRequest.getLicenseNumber())).thenReturn(false);
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("hashedPassword");
        when(providerRepository.save(any(Provider.class))).thenReturn(savedProvider);

        // When
        ProviderRegistrationResponse response = providerService.registerProvider(validRequest);

        // Then
        assertNotNull(response);
        assertEquals(savedProvider.getId(), response.getId());
        assertEquals(savedProvider.getFirstName(), response.getFirstName());
        assertEquals(savedProvider.getLastName(), response.getLastName());
        assertEquals(savedProvider.getEmail(), response.getEmail());
        assertEquals(savedProvider.getSpecialization(), response.getSpecialization());
        assertEquals(VerificationStatus.PENDING, response.getVerificationStatus());
        assertTrue(response.getMessage().contains("registered successfully"));

        verify(providerRepository).existsByEmail(validRequest.getEmail());
        verify(providerRepository).existsByPhoneNumber(validRequest.getPhoneNumber());
        verify(providerRepository).existsByLicenseNumber(validRequest.getLicenseNumber());
        verify(passwordEncoder).encode(validRequest.getPassword());
        verify(providerRepository).save(any(Provider.class));
    }

    @Test
    void testRegisterProvider_DuplicateEmail() {
        // Given
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(true);

        // When & Then
        ProviderService.DuplicateResourceException exception = assertThrows(
                ProviderService.DuplicateResourceException.class,
                () -> providerService.registerProvider(validRequest)
        );

        assertEquals("Email already registered: " + validRequest.getEmail(), exception.getMessage());
        verify(providerRepository).existsByEmail(validRequest.getEmail());
        verify(providerRepository, never()).save(any(Provider.class));
    }

    @Test
    void testRegisterProvider_DuplicatePhoneNumber() {
        // Given
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(providerRepository.existsByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(true);

        // When & Then
        ProviderService.DuplicateResourceException exception = assertThrows(
                ProviderService.DuplicateResourceException.class,
                () -> providerService.registerProvider(validRequest)
        );

        assertEquals("Phone number already registered: " + validRequest.getPhoneNumber(), exception.getMessage());
        verify(providerRepository).existsByEmail(validRequest.getEmail());
        verify(providerRepository).existsByPhoneNumber(validRequest.getPhoneNumber());
        verify(providerRepository, never()).save(any(Provider.class));
    }

    @Test
    void testRegisterProvider_DuplicateLicenseNumber() {
        // Given
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(providerRepository.existsByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(false);
        when(providerRepository.existsByLicenseNumber(validRequest.getLicenseNumber())).thenReturn(true);

        // When & Then
        ProviderService.DuplicateResourceException exception = assertThrows(
                ProviderService.DuplicateResourceException.class,
                () -> providerService.registerProvider(validRequest)
        );

        assertEquals("License number already registered: " + validRequest.getLicenseNumber(), exception.getMessage());
        verify(providerRepository).existsByEmail(validRequest.getEmail());
        verify(providerRepository).existsByPhoneNumber(validRequest.getPhoneNumber());
        verify(providerRepository).existsByLicenseNumber(validRequest.getLicenseNumber());
        verify(providerRepository, never()).save(any(Provider.class));
    }

    @Test
    void testRegisterProvider_InputSanitization() {
        // Given
        validRequest.setFirstName("  John  ");
        validRequest.setLastName("  Doe  ");
        validRequest.setEmail("  JOHN.DOE@EXAMPLE.COM  ");
        validRequest.setPhoneNumber("  +1234567890  ");
        validRequest.setSpecialization("  Cardiology  ");
        validRequest.setLicenseNumber("  lic123456  ");

        when(providerRepository.existsByEmail(any())).thenReturn(false);
        when(providerRepository.existsByPhoneNumber(any())).thenReturn(false);
        when(providerRepository.existsByLicenseNumber(any())).thenReturn(false);
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("hashedPassword");
        when(providerRepository.save(any(Provider.class))).thenReturn(savedProvider);

        // When
        providerService.registerProvider(validRequest);

        // Then
        verify(providerRepository).save(argThat(provider -> 
            provider.getFirstName().equals("John") &&
            provider.getLastName().equals("Doe") &&
            provider.getEmail().equals("john.doe@example.com") &&
            provider.getPhoneNumber().equals("+1234567890") &&
            provider.getSpecialization().equals("Cardiology") &&
            provider.getLicenseNumber().equals("LIC123456")
        ));
    }
} 