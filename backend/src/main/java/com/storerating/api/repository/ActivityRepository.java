package com.storerating.api.repository;

import com.storerating.api.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
/**
 * Interface for ActivityRepository.
 */

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    /**
     * Executes the findAllByOrderByCreatedAtDesc operation.
     */
    List<Activity> findAllByOrderByCreatedAtDesc();
}
