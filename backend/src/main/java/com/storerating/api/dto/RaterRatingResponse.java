package com.storerating.api.dto;

import java.time.LocalDateTime;

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
    public RaterRatingResponse() {}

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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRatingId() { return ratingId; }
    public void setRatingId(Long ratingId) { this.ratingId = ratingId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getPinned() { return pinned; }
    public void setPinned(Boolean pinned) { this.pinned = pinned; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    // Manual Builder
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

        public RaterRatingResponseBuilder id(Long id) { this.id = id; return this; }
        public RaterRatingResponseBuilder ratingId(Long ratingId) { this.ratingId = ratingId; return this; }
        public RaterRatingResponseBuilder name(String name) { this.name = name; return this; }
        public RaterRatingResponseBuilder email(String email) { this.email = email; return this; }
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
