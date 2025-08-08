package com.provider.registration.controller;

import com.provider.registration.dto.ProviderRegistrationRequest;
import com.provider.registration.dto.ProviderRegistrationResponse;
import com.provider.registration.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
@Slf4j
public class ProviderController {

    private final ProviderService providerService;

    @PostMapping("/register")
    public ResponseEntity<ProviderRegistrationResponse> registerProvider(
            @Valid @RequestBody ProviderRegistrationRequest request) {
        
        log.info("Received provider registration request for email: {}", request.getEmail());
        
        try {
            ProviderRegistrationResponse response = providerService.registerProvider(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ProviderService.DuplicateResourceException e) {
            log.error("Duplicate resource error: {}", e.getMessage());
            throw e;
        }
    }

    @ExceptionHandler(ProviderService.DuplicateResourceException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateResource(
            ProviderService.DuplicateResourceException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Conflict");
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Validation Error");
        errorResponse.put("status", HttpStatus.UNPROCESSABLE_ENTITY.value());
        
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        errorResponse.put("fieldErrors", fieldErrors);
        
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorResponse);
    }
} 