package com.storerating.api.dto;

import java.time.LocalDateTime;
import java.util.List;

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
    public AdminUserDetailResponse() {}

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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public List<StoreRatingInfo> getStores() { return stores; }
    public void setStores(List<StoreRatingInfo> stores) { this.stores = stores; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStoreDescription() { return storeDescription; }
    public void setStoreDescription(String storeDescription) { this.storeDescription = storeDescription; }

    public Boolean getRequestedModerator() { return requestedModerator; }
    public void setRequestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; }

    // Manual Builder
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

        public AdminUserDetailResponseBuilder id(Long id) { this.id = id; return this; }
        public AdminUserDetailResponseBuilder name(String name) { this.name = name; return this; }
        public AdminUserDetailResponseBuilder email(String email) { this.email = email; return this; }
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

        public StoreRatingInfo() {}

        public StoreRatingInfo(Long id, String name, Double averageRating) {
            this.id = id;
            this.name = name;
            this.averageRating = averageRating;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

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
