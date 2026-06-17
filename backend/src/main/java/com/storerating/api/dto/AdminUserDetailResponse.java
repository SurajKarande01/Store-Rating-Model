package com.storerating.api.dto;

import java.time.LocalDateTime;
import java.util.List;
/**
 * Represents the AdminUserDetailResponse class.
 */

public class AdminUserDetailResponse {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String role;
    private LocalDateTime createdAt;
    private Double rating;
    private List<StoreRatingInfo> stores;
    private String phone;
    private String location;
    private String storeDescription;
    private Boolean requestedModerator;

    // Constructors
    /**
     * Constructs a new AdminUserDetailResponse.
     */
    public AdminUserDetailResponse() {}
    /**
     * Constructs a new AdminUserDetailResponse.
     */

    public AdminUserDetailResponse(Long id, String name, String email, String address, String role, LocalDateTime createdAt, Double rating, List<StoreRatingInfo> stores, String phone, String location, String storeDescription, Boolean requestedModerator) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.role = role;
        this.createdAt = createdAt;
        this.rating = rating;
        this.stores = stores;
        this.phone = phone;
        this.location = location;
        this.storeDescription = storeDescription;
        this.requestedModerator = requestedModerator;
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
     * Gets the role.
     * @return the role
     */

    public String getRole() { return role; }
    /**
     * Sets the role.
     * @param role the new value
     */
    public void setRole(String role) { this.role = role; }
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
     * Gets the rating.
     * @return the rating
     */

    public Double getRating() { return rating; }
    /**
     * Sets the rating.
     * @param rating the new value
     */
    public void setRating(Double rating) { this.rating = rating; }
    /**
     * Gets the stores.
     * @return the stores
     */

    public List<StoreRatingInfo> getStores() { return stores; }
    /**
     * Sets the stores.
     * @param stores the new value
     */
    public void setStores(List<StoreRatingInfo> stores) { this.stores = stores; }
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

    // Manual Builder
    /**
     * Creates a new builder instance.
     * @return the builder
     */
    public static AdminUserDetailResponseBuilder builder() {
        return new AdminUserDetailResponseBuilder();
    }

    public static class AdminUserDetailResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String address;
        private String role;
        private LocalDateTime createdAt;
        private Double rating;
        private List<StoreRatingInfo> stores;
        private String phone;
        private String location;
        private String storeDescription;
        private Boolean requestedModerator;
        /**
         * Sets the id field for the builder.
         * @param id the value to set
         * @return the builder instance
         */

        public AdminUserDetailResponseBuilder id(Long id) { this.id = id; return this; }
        /**
         * Sets the name field for the builder.
         * @param name the value to set
         * @return the builder instance
         */
        public AdminUserDetailResponseBuilder name(String name) { this.name = name; return this; }
        /**
         * Sets the email field for the builder.
         * @param email the value to set
         * @return the builder instance
         */
        public AdminUserDetailResponseBuilder email(String email) { this.email = email; return this; }
        /**
         * Sets the address field for the builder.
         * @param address the value to set
         * @return the builder instance
         */
        public AdminUserDetailResponseBuilder address(String address) { this.address = address; return this; }
        public AdminUserDetailResponseBuilder role(String role) { this.role = role; return this; }
        public AdminUserDetailResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AdminUserDetailResponseBuilder rating(Double rating) { this.rating = rating; return this; }
        public AdminUserDetailResponseBuilder stores(List<StoreRatingInfo> stores) { this.stores = stores; return this; }
        public AdminUserDetailResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public AdminUserDetailResponseBuilder location(String location) { this.location = location; return this; }
        public AdminUserDetailResponseBuilder storeDescription(String storeDescription) { this.storeDescription = storeDescription; return this; }
        public AdminUserDetailResponseBuilder requestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; return this; }

        public AdminUserDetailResponse build() {
            return new AdminUserDetailResponse(id, name, email, address, role, createdAt, rating, stores, phone, location, storeDescription, requestedModerator);
        }
    }

    public static class StoreRatingInfo {
        private Long id;
        private String name;
        private Double averageRating;
        /**
         * Executes the StoreRatingInfo operation.
         */

        public StoreRatingInfo() {}
        /**
         * Executes the StoreRatingInfo operation.
         */

        public StoreRatingInfo(Long id, String name, Double averageRating) {
            this.id = id;
            this.name = name;
            this.averageRating = averageRating;
        }
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
        public void setName(String name) { this.name = name; }

        public Double getAverageRating() { return averageRating; }
        public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

        public static StoreRatingInfoBuilder builder() {
            return new StoreRatingInfoBuilder();
        }

        public static class StoreRatingInfoBuilder {
            private Long id;
            private String name;
            private Double averageRating;

            public StoreRatingInfoBuilder id(Long id) { this.id = id; return this; }
            public StoreRatingInfoBuilder name(String name) { this.name = name; return this; }
            public StoreRatingInfoBuilder averageRating(Double averageRating) { this.averageRating = averageRating; return this; }

            public StoreRatingInfo build() {
                return new StoreRatingInfo(id, name, averageRating);
            }
        }
    }
}
