package com.storerating.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
/**
 * Represents the Rating class.
 */

@Entity
@Table(
    name = "ratings",
    uniqueConstraints = {@UniqueConstraint(name = "unique_user_store", columnNames = {"user_id", "store_id"})}
)
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false)
    private Boolean pinned = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    /**
     * Constructs a new Rating.
     */
    public Rating() {}
    /**
     * Constructs a new Rating.
     */

    public Rating(Long id, User user, Store store, Integer rating, String comment, Boolean pinned, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.store = store;
        this.rating = rating;
        this.comment = comment;
        this.pinned = pinned;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters 
    // id
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
     * Gets the user.
     * @return the user
     */

    public User getUser() { return user; }
    /**
     * Sets the user.
     * @param user the new value
     */
    public void setUser(User user) { this.user = user; }
    /**
     * Gets the store.
     * @return the store
     */

    public Store getStore() { return store; }
    /**
     * Sets the store.
     * @param store the new value
     */
    public void setStore(Store store) { this.store = store; }
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

    // Manual Builder
    /**
     * Creates a new builder instance.
     * @return the builder
     */
    public static RatingBuilder builder() {
        return new RatingBuilder();
    }

    public static class RatingBuilder {
        private Long id;
        private User user;
        private Store store;
        private Integer rating;
        private String comment;
        private Boolean pinned = false;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        /**
         * Sets the id field for the builder.
         * @param id the value to set
         * @return the builder instance
         */

        public RatingBuilder id(Long id) { this.id = id; return this; }
        /**
         * Sets the user field for the builder.
         * @param user the value to set
         * @return the builder instance
         */
        public RatingBuilder user(User user) { this.user = user; return this; }
        /**
         * Sets the store field for the builder.
         * @param store the value to set
         * @return the builder instance
         */
        public RatingBuilder store(Store store) { this.store = store; return this; }
        /**
         * Sets the rating field for the builder.
         * @param rating the value to set
         * @return the builder instance
         */
        public RatingBuilder rating(Integer rating) { this.rating = rating; return this; }
        /**
         * Sets the comment field for the builder.
         * @param comment the value to set
         * @return the builder instance
         */
        public RatingBuilder comment(String comment) { this.comment = comment; return this; }
        /**
         * Sets the pinned field for the builder.
         * @param pinned the value to set
         * @return the builder instance
         */
        public RatingBuilder pinned(Boolean pinned) { this.pinned = pinned; return this; }
        public RatingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RatingBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Rating build() {
            return new Rating(id, user, store, rating, comment, pinned, createdAt, updatedAt);
        }
    }
}
