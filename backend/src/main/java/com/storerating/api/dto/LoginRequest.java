package com.storerating.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
/**
 * Represents the LoginRequest class.
 */

public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    // Constructors
    /**
     * Constructs a new LoginRequest.
     */
    public LoginRequest() {}
    /**
     * Constructs a new LoginRequest.
     */

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
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
}
