package com.storerating.api.repository;

import com.storerating.api.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndStoreId(Long userId, Long storeId);
    Optional<Rating> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Rating r WHERE r.store.id IN :storeIds")
    Double getAverageRatingForStores(@Param("storeIds") List<Long> storeIds);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.store.id IN :storeIds")
    Long countRatingsForStores(@Param("storeIds") List<Long> storeIds);

    List<Rating> findByStoreIdInOrderByPinnedDescCreatedAtDesc(List<Long> storeIds);
    List<Rating> findByStoreIdOrderByPinnedDescCreatedAtDesc(Long storeId);
}
