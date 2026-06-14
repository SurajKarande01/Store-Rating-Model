package com.storerating.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
    public Rating() {}

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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Store getStore() { return store; }
    public void setStore(Store store) { this.store = store; }

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

    // Manual Builder
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

        public RatingBuilder id(Long id) { this.id = id; return this; }
        public RatingBuilder user(User user) { this.user = user; return this; }
        public RatingBuilder store(Store store) { this.store = store; return this; }
        public RatingBuilder rating(Integer rating) { this.rating = rating; return this; }
        public RatingBuilder comment(String comment) { this.comment = comment; return this; }
        public RatingBuilder pinned(Boolean pinned) { this.pinned = pinned; return this; }
        public RatingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RatingBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Rating build() {
            return new Rating(id, user, store, rating, comment, pinned, createdAt, updatedAt);
        }
    }
}
