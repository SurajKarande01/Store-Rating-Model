package com.storerating.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
/**
 * Represents the ChangePasswordRequest class.
 */

public class ChangePasswordRequest {
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;

    // Constructors
    /**
     * Constructs a new ChangePasswordRequest.
     */
    public ChangePasswordRequest() {}
    /**
     * Constructs a new ChangePasswordRequest.
     */

    public ChangePasswordRequest(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    // Getters and Setters
    /**
     * Gets the currentPassword.
     * @return the currentPassword
     */
    public String getCurrentPassword() { return currentPassword; }
    /**
     * Sets the currentPassword.
     * @param currentPassword the new value
     */
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    /**
     * Gets the newPassword.
     * @return the newPassword
     */

    public String getNewPassword() { return newPassword; }
    /**
     * Sets the newPassword.
     * @param newPassword the new value
     */
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
