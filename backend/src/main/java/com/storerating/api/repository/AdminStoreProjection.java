package com.storerating.api.repository;
/**
 * Interface for AdminStoreProjection.
 */

public interface AdminStoreProjection {
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
     * Gets the ownerId.
     * @return the ownerId
     */
    Long getOwnerId();
    /**
     * Gets the rating.
     * @return the rating
     */
    Double getRating();
    /**
     * Gets the ratingCount.
     * @return the ratingCount
     */
    Long getRatingCount();
}
