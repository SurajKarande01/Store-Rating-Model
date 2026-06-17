package com.storerating.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
/**
 * Represents the SignupRequest class.
 */

public class SignupRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 60, message = "Name must not exceed 60 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String address;
    private String phone;
    private String location;
    private String storeDescription;
    private String role;

    // Constructors
    /**
     * Constructs a new SignupRequest.
     */
    public SignupRequest() {}
    /**
     * Constructs a new SignupRequest.
     */

    public SignupRequest(String name, String email, String password, String address, String phone, String location, String storeDescription, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phone = phone;
        this.location = location;
        this.storeDescription = storeDescription;
        this.role = role;
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
     * Gets the password.
     * @return the password
     */

    public String getPassword() { return password; }
    /**
     * Sets the password.
     * @param password the new value
     */
    public void setPassword(String password) { this.password = password; }
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
     * Gets the role.
     * @return the role
     */

    public String getRole() { return role; }
    /**
     * Sets the role.
     * @param role the new value
     */
    public void setRole(String role) { this.role = role; }
}
