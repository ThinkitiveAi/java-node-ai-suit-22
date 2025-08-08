package com.provider.registration.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.provider.registration.dto.ClinicAddressDto;
import com.provider.registration.dto.ProviderRegistrationRequest;
import com.provider.registration.dto.ProviderRegistrationResponse;
import com.provider.registration.model.VerificationStatus;
import com.provider.registration.service.ProviderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProviderController.class)
class ProviderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProviderService providerService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegisterProvider_Success() throws Exception {
        // Given
        ProviderRegistrationRequest request = createValidRequest();
        ProviderRegistrationResponse response = createValidResponse();

        when(providerService.registerProvider(any(ProviderRegistrationRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(response.getId().toString()))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.specialization").value("Cardiology"))
                .andExpect(jsonPath("$.verificationStatus").value("PENDING"))
                .andExpect(jsonPath("$.message").value("Provider registered successfully. Verification status: PENDING"));
    }

    @Test
    void testRegisterProvider_ValidationError_MissingFields() throws Exception {
        // Given
        ProviderRegistrationRequest request = new ProviderRegistrationRequest();
        // Missing required fields

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.fieldErrors.firstName").value("First name is required"))
                .andExpect(jsonPath("$.fieldErrors.lastName").value("Last name is required"))
                .andExpect(jsonPath("$.fieldErrors.email").value("Email is required"))
                .andExpect(jsonPath("$.fieldErrors.phoneNumber").value("Phone number is required"))
                .andExpect(jsonPath("$.fieldErrors.password").value("Password is required"))
                .andExpect(jsonPath("$.fieldErrors.specialization").value("Specialization is required"))
                .andExpect(jsonPath("$.fieldErrors.licenseNumber").value("License number is required"));
    }

    @Test
    void testRegisterProvider_ValidationError_InvalidEmail() throws Exception {
        // Given
        ProviderRegistrationRequest request = createValidRequest();
        request.setEmail("invalid-email");

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.fieldErrors.email").value("Email must be a valid email address"));
    }

    @Test
    void testRegisterProvider_ValidationError_WeakPassword() throws Exception {
        // Given
        ProviderRegistrationRequest request = createValidRequest();
        request.setPassword("weak");

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    void testRegisterProvider_ValidationError_InvalidPhoneNumber() throws Exception {
        // Given
        ProviderRegistrationRequest request = createValidRequest();
        request.setPhoneNumber("invalid-phone");

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.fieldErrors.phoneNumber").value("Phone number must be a valid international format"));
    }

    @Test
    void testRegisterProvider_ValidationError_InvalidLicenseNumber() throws Exception {
        // Given
        ProviderRegistrationRequest request = createValidRequest();
        request.setLicenseNumber("LIC-123-456");

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.fieldErrors.licenseNumber").value("License number must contain only alphanumeric characters"));
    }

    @Test
    void testRegisterProvider_ValidationError_InvalidYearsOfExperience() throws Exception {
        // Given
        ProviderRegistrationRequest request = createValidRequest();
        request.setYearsOfExperience(60);

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.fieldErrors.yearsOfExperience").value("Years of experience cannot exceed 50"));
    }

    @Test
    void testRegisterProvider_ValidationError_InvalidZipCode() throws Exception {
        // Given
        ProviderRegistrationRequest request = createValidRequest();
        request.getClinicAddress().setZip("invalid");

        // When & Then
        mockMvc.perform(post("/providers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.fieldErrors.clinicAddress.zip").value("ZIP code must be 5 or 6 digits"));
    }

    private ProviderRegistrationRequest createValidRequest() {
        ProviderRegistrationRequest request = new ProviderRegistrationRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@example.com");
        request.setPhoneNumber("+1234567890");
        request.setPassword("StrongPass123!");
        request.setSpecialization("Cardiology");
        request.setLicenseNumber("LIC123456");
        request.setYearsOfExperience(10);

        ClinicAddressDto addressDto = new ClinicAddressDto();
        addressDto.setStreet("123 Main St");
        addressDto.setCity("New York");
        addressDto.setState("NY");
        addressDto.setZip("10001");
        request.setClinicAddress(addressDto);

        return request;
    }

    private ProviderRegistrationResponse createValidResponse() {
        return new ProviderRegistrationResponse(
                UUID.randomUUID(),
                "John",
                "Doe",
                "john.doe@example.com",
                "Cardiology",
                VerificationStatus.PENDING,
                LocalDateTime.now(),
                "Provider registered successfully. Verification status: PENDING"
        );
    }
} 