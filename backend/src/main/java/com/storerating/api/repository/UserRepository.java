package com.storerating.api.repository;

import com.storerating.api.entity.Role;
import com.storerating.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
/**
 * Interface for UserRepository.
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Executes the findByEmail operation.
     */
    Optional<User> findByEmail(String email);
    /**
     * Executes the existsByEmail operation.
     */
    boolean existsByEmail(String email);
    /**
     * Executes the findAllFiltered operation.
     */

    @Query("SELECT u FROM User u WHERE " +
            "(:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(:address IS NULL OR LOWER(u.address) LIKE LOWER(CONCAT('%', :address, '%'))) AND " +
            "(:role IS NULL OR u.role = :role)")
    List<User> findAllFiltered(
            @Param("name") String name,
            @Param("email") String email,
            @Param("address") String address,
            @Param("role") Role role);
}

