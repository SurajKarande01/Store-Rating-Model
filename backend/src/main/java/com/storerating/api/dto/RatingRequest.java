package com.storerating.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
/**
 * Represents the RatingRequest class.
 */

public class RatingRequest {
    @NotNull(message = "Store ID is required")
    private Long storeId;

    @NotNull(message = "Rating value is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;

    private String comment;

    // Constructors
    /**
     * Constructs a new RatingRequest.
     */
    public RatingRequest() {}
    /**
     * Constructs a new RatingRequest.
     */

    public RatingRequest(Long storeId, Integer rating, String comment) {
        this.storeId = storeId;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters and Setters
    /**
     * Gets the storeId.
     * @return the storeId
     */
    public Long getStoreId() { return storeId; }
    /**
     * Sets the storeId.
     * @param storeId the new value
     */
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    /**
     * Gets the rating.
     * @return the rating
     */

    public Integer getRating() { return rating; }
    /**
     * Sets the rating.
     * @param rating the new value
     */
    public void setRating(Integer rating) { this.rating = rating; }
    /**
     * Gets the comment.
     * @return the comment
     */

    public String getComment() { return comment; }
    /**
     * Sets the comment.
     * @param comment the new value
     */
    public void setComment(String comment) { this.comment = comment; }
}
