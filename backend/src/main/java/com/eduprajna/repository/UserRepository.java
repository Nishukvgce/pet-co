package com.eduprajna.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduprajna.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    /**
     * Find users created between two dates (inclusive)
     */
    List<User> findByCreatedAtBetween(OffsetDateTime start, OffsetDateTime end);
}