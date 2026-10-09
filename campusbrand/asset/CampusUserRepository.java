package com.campusbrand.asset;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CampusUserRepository extends JpaRepository<CampusUser, Long> {
    Optional<CampusUser> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
