package com.storerating.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateStoreRequest {
    @NotBlank(message = "Store name is required")
    @Size(max = 60, message = "Store name must not exceed 60 characters")
    private String name;

    @NotBlank(message = "Store email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Store email must not exceed 255 characters")
    private String email;

    private String address;

    private Long ownerId;

    // Constructors
    public CreateStoreRequest() {}

    public CreateStoreRequest(String name, String email, String address, Long ownerId) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.ownerId = ownerId;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}
