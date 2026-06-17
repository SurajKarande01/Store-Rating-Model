package com.storerating.api.repository;
/**
 * Interface for StoreProjection.
 */

public interface StoreProjection {
    /**
     * Gets the id.
     * @return the id
     */
    Long getId();
    /**
     * Gets the name.
     * @return the name
     */
    String getName();
    /**
     * Gets the email.
     * @return the email
     */
    String getEmail();
    /**
     * Gets the address.
     * @return the address
     */
    String getAddress();
    /**
     * Gets the overallRating.
     * @return the overallRating
     */
    Double getOverallRating();
    /**
     * Gets the totalRatings.
     * @return the totalRatings
     */
    Long getTotalRatings();
    /**
     * Gets the userRating.
     * @return the userRating
     */
    Integer getUserRating();
    /**
     * Gets the userRatingId.
     * @return the userRatingId
     */
    Long getUserRatingId();
}
