package com.storerating.api.repository;

import com.storerating.api.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
/**
 * Interface for StoreRepository.
 */

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    /**
     * Executes the findByOwnerId operation.
     */
    List<Store> findByOwnerId(Long ownerId);
    /**
     * Executes the existsByEmail operation.
     */
    boolean existsByEmail(String email);
    /**
     * Executes the findAllStoresWithUserRating operation.
     */

    @Query(value = "SELECT s.id as id, s.name as name, s.email as email, s.address as address, " +
            "COALESCE(AVG(r.rating), 0.0) as overallRating, " +
            "COUNT(r.id) as totalRatings, " +
            "(SELECT rating FROM ratings WHERE user_id = :userId AND store_id = s.id) as userRating, " +
            "(SELECT id FROM ratings WHERE user_id = :userId AND store_id = s.id) as userRatingId " +
            "FROM stores s " +
            "LEFT JOIN ratings r ON r.store_id = s.id " +
            "WHERE (:name IS NULL OR s.name LIKE %:name%) " +
            "AND (:address IS NULL OR s.address LIKE %:address%) " +
            /**
             * Executes the findAllStoresWithUserRating operation.
             */
            "GROUP BY s.id, s.name, s.email, s.address",
            /**
             * Executes the findAllStoresWithUserRating operation.
             */
            nativeQuery = true)
    List<StoreProjection> findAllStoresWithUserRating(
            @Param("userId") Long userId,
            @Param("name") String name,
            @Param("address") String address);
    /**
     * Executes the findAllStoresForAdmin operation.
     */

    @Query(value = "SELECT s.id as id, s.name as name, s.email as email, s.address as address, s.owner_id as ownerId, " +
            "COALESCE(AVG(r.rating), 0.0) as rating, " +
            "COUNT(r.id) as ratingCount " +
            "FROM stores s " +
            "LEFT JOIN ratings r ON r.store_id = s.id " +
            "WHERE (:name IS NULL OR s.name LIKE %:name%) " +
            "AND (:email IS NULL OR s.email LIKE %:email%) " +
            "AND (:address IS NULL OR s.address LIKE %:address%) " +
            /**
             * Executes the findAllStoresForAdmin operation.
             */
            "GROUP BY s.id, s.name, s.email, s.address, s.owner_id",
            /**
             * Executes the findAllStoresForAdmin operation.
             */
            nativeQuery = true)
    List<AdminStoreProjection> findAllStoresForAdmin(
            @Param("name") String name,
            @Param("email") String email,
            @Param("address") String address);
}
