package com.storerating.api.repository;

import com.storerating.api.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByOwnerId(Long ownerId);
    boolean existsByEmail(String email);

    @Query(value = "SELECT s.id as id, s.name as name, s.email as email, s.address as address, " +
            "COALESCE(AVG(r.rating), 0.0) as overallRating, " +
            "COUNT(r.id) as totalRatings, " +
            "(SELECT rating FROM ratings WHERE user_id = :userId AND store_id = s.id) as userRating, " +
            "(SELECT id FROM ratings WHERE user_id = :userId AND store_id = s.id) as userRatingId " +
            "FROM stores s " +
            "LEFT JOIN ratings r ON r.store_id = s.id " +
            "WHERE (:name IS NULL OR s.name LIKE %:name%) " +
            "AND (:address IS NULL OR s.address LIKE %:address%) " +
            "GROUP BY s.id, s.name, s.email, s.address",
            nativeQuery = true)
    List<StoreProjection> findAllStoresWithUserRating(
            @Param("userId") Long userId,
            @Param("name") String name,
            @Param("address") String address);

    @Query(value = "SELECT s.id as id, s.name as name, s.email as email, s.address as address, s.owner_id as ownerId, " +
            "COALESCE(AVG(r.rating), 0.0) as rating, " +
            "COUNT(r.id) as ratingCount " +
            "FROM stores s " +
            "LEFT JOIN ratings r ON r.store_id = s.id " +
            "WHERE (:name IS NULL OR s.name LIKE %:name%) " +
            "AND (:email IS NULL OR s.email LIKE %:email%) " +
            "AND (:address IS NULL OR s.address LIKE %:address%) " +
            "GROUP BY s.id, s.name, s.email, s.address, s.owner_id",
            nativeQuery = true)
    List<AdminStoreProjection> findAllStoresForAdmin(
            @Param("name") String name,
            @Param("email") String email,
            @Param("address") String address);
}
