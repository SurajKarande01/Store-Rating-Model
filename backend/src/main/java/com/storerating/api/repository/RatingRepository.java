package com.storerating.api.repository;

import com.storerating.api.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
/**
 * Interface for RatingRepository.
 */

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    /**
     * Executes the findByUserIdAndStoreId operation.
     */
    Optional<Rating> findByUserIdAndStoreId(Long userId, Long storeId);
    /**
     * Executes the findByIdAndUserId operation.
     */
    Optional<Rating> findByIdAndUserId(Long id, Long userId);
    /**
     * Gets the averageRatingForStores.
     * @return the averageRatingForStores
     */

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Rating r WHERE r.store.id IN :storeIds")
    Double getAverageRatingForStores(@Param("storeIds") List<Long> storeIds);
    /**
     * Executes the countRatingsForStores operation.
     */

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.store.id IN :storeIds")
    Long countRatingsForStores(@Param("storeIds") List<Long> storeIds);
    /**
     * Executes the findByStoreIdInOrderByPinnedDescCreatedAtDesc operation.
     */

    List<Rating> findByStoreIdInOrderByPinnedDescCreatedAtDesc(List<Long> storeIds);
    /**
     * Executes the findByStoreIdOrderByPinnedDescCreatedAtDesc operation.
     */
    List<Rating> findByStoreIdOrderByPinnedDescCreatedAtDesc(Long storeId);
}
