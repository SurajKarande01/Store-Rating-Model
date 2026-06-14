package com.storerating.api.dto;

import java.time.LocalDateTime;

public class AdminUserResponse {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String role;
    private LocalDateTime createdAt;
    private Double rating;
    private String phone;
    private String location;
    private String storeDescription;
    private Boolean requestedModerator;

    // Constructors
    public AdminUserResponse() {}

    public AdminUserResponse(Long id, String name, String email, String address, String role, LocalDateTime createdAt, Double rating, String phone, String location, String storeDescription, Boolean requestedModerator) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.role = role;
        this.createdAt = createdAt;
        this.rating = rating;
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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStoreDescription() { return storeDescription; }
    public void setStoreDescription(String storeDescription) { this.storeDescription = storeDescription; }

    public Boolean getRequestedModerator() { return requestedModerator; }
    public void setRequestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; }

    // Manual Builder
    public static AdminUserResponseBuilder builder() {
        return new AdminUserResponseBuilder();
    }

    public static class AdminUserResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String address;
        private String role;
        private LocalDateTime createdAt;
        private Double rating;
        private String phone;
        private String location;
        private String storeDescription;
        private Boolean requestedModerator;

        public AdminUserResponseBuilder id(Long id) { this.id = id; return this; }
        public AdminUserResponseBuilder name(String name) { this.name = name; return this; }
        public AdminUserResponseBuilder email(String email) { this.email = email; return this; }
        public AdminUserResponseBuilder address(String address) { this.address = address; return this; }
        public AdminUserResponseBuilder role(String role) { this.role = role; return this; }
        public AdminUserResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AdminUserResponseBuilder rating(Double rating) { this.rating = rating; return this; }
        public AdminUserResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public AdminUserResponseBuilder location(String location) { this.location = location; return this; }
        public AdminUserResponseBuilder storeDescription(String storeDescription) { this.storeDescription = storeDescription; return this; }
        public AdminUserResponseBuilder requestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; return this; }

        public AdminUserResponse build() {
            return new AdminUserResponse(id, name, email, address, role, createdAt, rating, phone, location, storeDescription, requestedModerator);
        }
    }
}
