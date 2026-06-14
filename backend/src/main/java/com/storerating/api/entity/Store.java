package com.storerating.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stores")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 400)
    private String address;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Store() {}

    public Store(Long id, String name, String email, String address, String imageUrl, String description, User owner, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.imageUrl = imageUrl;
        this.description = description;
        this.owner = owner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Manual Builder
    public static StoreBuilder builder() {
        return new StoreBuilder();
    }

    public static class StoreBuilder {
        private Long id;
        private String name;
        private String email;
        private String address;
        private String imageUrl;
        private String description;
        private User owner;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public StoreBuilder id(Long id) { this.id = id; return this; }
        public StoreBuilder name(String name) { this.name = name; return this; }
        public StoreBuilder email(String email) { this.email = email; return this; }
        public StoreBuilder address(String address) { this.address = address; return this; }
        public StoreBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public StoreBuilder description(String description) { this.description = description; return this; }
        public StoreBuilder owner(User owner) { this.owner = owner; return this; }
        public StoreBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public StoreBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Store build() {
            return new Store(id, name, email, address, imageUrl, description, owner, createdAt, updatedAt);
        }
    }
}
