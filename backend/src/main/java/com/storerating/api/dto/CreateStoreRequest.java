package com.storerating.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
/**
 * Represents the CreateStoreRequest class.
 */

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
    /**
     * Constructs a new CreateStoreRequest.
     */
    public CreateStoreRequest() {}
    /**
     * Constructs a new CreateStoreRequest.
     */

    public CreateStoreRequest(String name, String email, String address, Long ownerId) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.ownerId = ownerId;
    }

    // Getters and Setters
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
     * Gets the ownerId.
     * @return the ownerId
     */

    public Long getOwnerId() { return ownerId; }
    /**
     * Sets the ownerId.
     * @param ownerId the new value
     */
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}
