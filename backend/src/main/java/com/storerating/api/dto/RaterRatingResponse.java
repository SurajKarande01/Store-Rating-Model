package com.storerating.api.dto;

import java.time.LocalDateTime;
/**
 * Represents the RaterRatingResponse class.
 */

public class RaterRatingResponse {
    private Long id; // User ID
    private Long ratingId; // Rating ID
    private String name;
    private String email;
    private Integer rating;
    private String comment;
    private Boolean pinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String storeName;

    // Constructors
    /**
     * Constructs a new RaterRatingResponse.
     */
    public RaterRatingResponse() {}
    /**
     * Constructs a new RaterRatingResponse.
     */

    public RaterRatingResponse(Long id, Long ratingId, String name, String email, Integer rating, String comment, Boolean pinned, LocalDateTime createdAt, LocalDateTime updatedAt, String storeName) {
        this.id = id;
        this.ratingId = ratingId;
        this.name = name;
        this.email = email;
        this.rating = rating;
        this.comment = comment;
        this.pinned = pinned;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.storeName = storeName;
    }

    // Getters and Setters
    /**
     * Gets the id.
     * @return the id
     */
    public Long getId() { return id; }
    /**
     * Sets the id.
     * @param id the new value
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Gets the ratingId.
     * @return the ratingId
     */

    public Long getRatingId() { return ratingId; }
    /**
     * Sets the ratingId.
     * @param ratingId the new value
     */
    public void setRatingId(Long ratingId) { this.ratingId = ratingId; }
    /**
     * Gets the name.
     * @return the name
     */

    public String getName() { return name; }
    /**
     * Sets the name.
     * @param name the new value
     */
    public void setName(String name) { this.name = name; }
    /**
     * Gets the email.
     * @return the email
     */

    public String getEmail() { return email; }
    /**
     * Sets the email.
     * @param email the new value
     */
    public void setEmail(String email) { this.email = email; }
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
    /**
     * Gets the pinned.
     * @return the pinned
     */

    public Boolean getPinned() { return pinned; }
    /**
     * Sets the pinned.
     * @param pinned the new value
     */
    public void setPinned(Boolean pinned) { this.pinned = pinned; }
    /**
     * Gets the createdAt.
     * @return the createdAt
     */

    public LocalDateTime getCreatedAt() { return createdAt; }
    /**
     * Sets the createdAt.
     * @param createdAt the new value
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    /**
     * Gets the updatedAt.
     * @return the updatedAt
     */

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    /**
     * Sets the updatedAt.
     * @param updatedAt the new value
     */
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    /**
     * Gets the storeName.
     * @return the storeName
     */

    public String getStoreName() { return storeName; }
    /**
     * Sets the storeName.
     * @param storeName the new value
     */
    public void setStoreName(String storeName) { this.storeName = storeName; }

    // Manual Builder
    /**
     * Creates a new builder instance.
     * @return the builder
     */
    public static RaterRatingResponseBuilder builder() {
        return new RaterRatingResponseBuilder();
    }

    public static class RaterRatingResponseBuilder {
        private Long id;
        private Long ratingId;
        private String name;
        private String email;
        private Integer rating;
        private String comment;
        private Boolean pinned;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String storeName;
        /**
         * Sets the id field for the builder.
         * @param id the value to set
         * @return the builder instance
         */

        public RaterRatingResponseBuilder id(Long id) { this.id = id; return this; }
        /**
         * Sets the ratingId field for the builder.
         * @param ratingId the value to set
         * @return the builder instance
         */
        public RaterRatingResponseBuilder ratingId(Long ratingId) { this.ratingId = ratingId; return this; }
        /**
         * Sets the name field for the builder.
         * @param name the value to set
         * @return the builder instance
         */
        public RaterRatingResponseBuilder name(String name) { this.name = name; return this; }
        /**
         * Sets the email field for the builder.
         * @param email the value to set
         * @return the builder instance
         */
        public RaterRatingResponseBuilder email(String email) { this.email = email; return this; }
        /**
         * Sets the rating field for the builder.
         * @param rating the value to set
         * @return the builder instance
         */
        public RaterRatingResponseBuilder rating(Integer rating) { this.rating = rating; return this; }
        public RaterRatingResponseBuilder comment(String comment) { this.comment = comment; return this; }
        public RaterRatingResponseBuilder pinned(Boolean pinned) { this.pinned = pinned; return this; }
        public RaterRatingResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RaterRatingResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public RaterRatingResponseBuilder storeName(String storeName) { this.storeName = storeName; return this; }

        public RaterRatingResponse build() {
            return new RaterRatingResponse(id, ratingId, name, email, rating, comment, pinned, createdAt, updatedAt, storeName);
        }
    }
}
