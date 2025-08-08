package com.provider.registration.repository;

import com.provider.registration.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, UUID> {
    
    Optional<Provider> findByEmail(String email);
    
    Optional<Provider> findByPhoneNumber(String phoneNumber);
    
    Optional<Provider> findByLicenseNumber(String licenseNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    boolean existsByLicenseNumber(String licenseNumber);
}
