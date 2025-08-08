package com.provider.registration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ProviderRegistrationApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProviderRegistrationApplication.class, args);
    }
} 