package com.provider.registration.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class StrongPasswordValidatorTest {

    private StrongPasswordValidator validator;

    @BeforeEach
    void setUp() {
        validator = new StrongPasswordValidator();
    }

    @Test
    void testValidPassword() {
        assertTrue(validator.isValid("StrongPass123!", null));
    }

    @Test
    void testNullPassword() {
        assertFalse(validator.isValid(null, null));
    }

    @Test
    void testEmptyPassword() {
        assertFalse(validator.isValid("", null));
    }

    @Test
    void testWhitespaceOnlyPassword() {
        assertFalse(validator.isValid("   ", null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "short1!",      // Too short
        "nouppercase123!", // No uppercase
        "NOLOWERCASE123!", // No lowercase
        "NoNumbers!",   // No numbers
        "NoSpecial123"  // No special characters
    })
    void testInvalidPasswords(String password) {
        assertFalse(validator.isValid(password, null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "ValidPass1!",
        "Another2@",
        "TestPass3#",
        "MyPass4$",
        "Secure5%"
    })
    void testValidPasswords(String password) {
        assertTrue(validator.isValid(password, null));
    }
} 