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

    // Constructors
    public AdminUserResponse() {}

    public AdminUserResponse(Long id, String name, String email, String address, String role, LocalDateTime createdAt, Double rating) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.role = role;
        this.createdAt = createdAt;
        this.rating = rating;
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

        public AdminUserResponseBuilder id(Long id) { this.id = id; return this; }
        public AdminUserResponseBuilder name(String name) { this.name = name; return this; }
        public AdminUserResponseBuilder email(String email) { this.email = email; return this; }
        public AdminUserResponseBuilder address(String address) { this.address = address; return this; }
        public AdminUserResponseBuilder role(String role) { this.role = role; return this; }
        public AdminUserResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AdminUserResponseBuilder rating(Double rating) { this.rating = rating; return this; }

        public AdminUserResponse build() {
            return new AdminUserResponse(id, name, email, address, role, createdAt, rating);
        }
    }
}
