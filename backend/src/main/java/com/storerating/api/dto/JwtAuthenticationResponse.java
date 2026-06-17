package com.storerating.api.dto;
/**
 * Represents the JwtAuthenticationResponse class.
 */

public class JwtAuthenticationResponse {
    private String message;
    private String token;
    private UserResponse user;

    // Constructors
    /**
     * Constructs a new JwtAuthenticationResponse.
     */
    public JwtAuthenticationResponse() {}
    /**
     * Constructs a new JwtAuthenticationResponse.
     */

    public JwtAuthenticationResponse(String message, String token, UserResponse user) {
        this.message = message;
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    /**
     * Gets the message.
     * @return the message
     */
    public String getMessage() { return message; }
    /**
     * Sets the message.
     * @param message the new value
     */
    public void setMessage(String message) { this.message = message; }
    /**
     * Gets the token.
     * @return the token
     */

    public String getToken() { return token; }
    /**
     * Sets the token.
     * @param token the new value
     */
    public void setToken(String token) { this.token = token; }
    /**
     * Gets the user.
     * @return the user
     */

    public UserResponse getUser() { return user; }
    /**
     * Sets the user.
     * @param user the new value
     */
    public void setUser(UserResponse user) { this.user = user; }
}
