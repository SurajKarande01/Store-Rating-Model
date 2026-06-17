package com.storerating.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
/**
 * Represents the User class.
 */

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 400)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String location;

    @Column(name = "store_description", length = 1000)
    private String storeDescription;

    @Column(name = "requested_moderator", nullable = false)
    private Boolean requestedModerator = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    /**
     * Constructs a new User.
     */
    public User() {}
    /**
     * Constructs a new User.
     */

    public User(Long id, String name, String email, String passwordHash, String address, Role role, String phone, String location, String storeDescription, Boolean requestedModerator, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.address = address;
        this.role = role;
        this.phone = phone;
        this.location = location;
        this.storeDescription = storeDescription;
        this.requestedModerator = requestedModerator;
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
     * Gets the passwordHash.
     * @return the passwordHash
     */

    public String getPasswordHash() { return passwordHash; }
    /**
     * Sets the passwordHash.
     * @param passwordHash the new value
     */
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
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
     * Gets the role.
     * @return the role
     */

    public Role getRole() { return role; }
    /**
     * Sets the role.
     * @param role the new value
     */
    public void setRole(Role role) { this.role = role; }
    /**
     * Gets the phone.
     * @return the phone
     */

    public String getPhone() { return phone; }
    /**
     * Sets the phone.
     * @param phone the new value
     */
    public void setPhone(String phone) { this.phone = phone; }
    /**
     * Gets the location.
     * @return the location
     */

    public String getLocation() { return location; }
    /**
     * Sets the location.
     * @param location the new value
     */
    public void setLocation(String location) { this.location = location; }
    /**
     * Gets the storeDescription.
     * @return the storeDescription
     */

    public String getStoreDescription() { return storeDescription; }
    /**
     * Sets the storeDescription.
     * @param storeDescription the new value
     */
    public void setStoreDescription(String storeDescription) { this.storeDescription = storeDescription; }
    /**
     * Gets the requestedModerator.
     * @return the requestedModerator
     */

    public Boolean getRequestedModerator() { return requestedModerator; }
    /**
     * Sets the requestedModerator.
     * @param requestedModerator the new value
     */
    public void setRequestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; }
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
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String passwordHash;
        private String address;
        private Role role;
        private String phone;
        private String location;
        private String storeDescription;
        private Boolean requestedModerator = false;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        /**
         * Sets the id field for the builder.
         * @param id the value to set
         * @return the builder instance
         */

        public UserBuilder id(Long id) { this.id = id; return this; }
        /**
         * Sets the name field for the builder.
         * @param name the value to set
         * @return the builder instance
         */
        public UserBuilder name(String name) { this.name = name; return this; }
        /**
         * Sets the email field for the builder.
         * @param email the value to set
         * @return the builder instance
         */
        public UserBuilder email(String email) { this.email = email; return this; }
        /**
         * Sets the passwordHash field for the builder.
         * @param passwordHash the value to set
         * @return the builder instance
         */
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder address(String address) { this.address = address; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder phone(String phone) { this.phone = phone; return this; }
        public UserBuilder location(String location) { this.location = location; return this; }
        public UserBuilder storeDescription(String storeDescription) { this.storeDescription = storeDescription; return this; }
        public UserBuilder requestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, name, email, passwordHash, address, role, phone, location, storeDescription, requestedModerator, createdAt, updatedAt);
        }
    }
}
