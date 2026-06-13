package com.storerating.api.dto;

public class JwtAuthenticationResponse {
    private String message;
    private String token;
    private UserResponse user;

    // Constructors
    public JwtAuthenticationResponse() {}

    public JwtAuthenticationResponse(String message, String token, UserResponse user) {
        this.message = message;
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
}
