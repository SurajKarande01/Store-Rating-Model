package com.storerating.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
/**
 * Represents the Store class.
 */

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
    /**
     * Constructs a new Store.
     */
    public Store() {}
    /**
     * Constructs a new Store.
     */

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
     * Gets the address.
     * @return the address
     */

    public String getAddress() { return address; }
    /**
     * Sets the address.
     * @param address the new value
     */
    public void setAddress(String address) { this.address = address; }
    /**
     * Gets the imageUrl.
     * @return the imageUrl
     */

    public String getImageUrl() { return imageUrl; }
    /**
     * Sets the imageUrl.
     * @param imageUrl the new value
     */
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    /**
     * Gets the description.
     * @return the description
     */

    public String getDescription() { return description; }
    /**
     * Sets the description.
     * @param description the new value
     */
    public void setDescription(String description) { this.description = description; }
    /**
     * Gets the owner.
     * @return the owner
     */

    public User getOwner() { return owner; }
    /**
     * Sets the owner.
     * @param owner the new value
     */
    public void setOwner(User owner) { this.owner = owner; }
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
        /**
         * Sets the id field for the builder.
         * @param id the value to set
         * @return the builder instance
         */

        public StoreBuilder id(Long id) { this.id = id; return this; }
        /**
         * Sets the name field for the builder.
         * @param name the value to set
         * @return the builder instance
         */
        public StoreBuilder name(String name) { this.name = name; return this; }
        /**
         * Sets the email field for the builder.
         * @param email the value to set
         * @return the builder instance
         */
        public StoreBuilder email(String email) { this.email = email; return this; }
        /**
         * Sets the address field for the builder.
         * @param address the value to set
         * @return the builder instance
         */
        public StoreBuilder address(String address) { this.address = address; return this; }
        /**
         * Sets the imageUrl field for the builder.
         * @param imageUrl the value to set
         * @return the builder instance
         */
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
