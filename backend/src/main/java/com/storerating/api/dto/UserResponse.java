package com.storerating.api.dto;
/**
 * Represents the UserResponse class.
 */

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String address;
    private String phone;
    private String location;
    private String storeDescription;
    private Boolean requestedModerator;

    // Constructors
    /**
     * Constructs a new UserResponse.
     */
    public UserResponse() {}
    /**
     * Constructs a new UserResponse.
     */

    public UserResponse(Long id, String name, String email, String role, String address, String phone, String location, String storeDescription, Boolean requestedModerator) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.address = address;
        this.phone = phone;
        this.location = location;
        this.storeDescription = storeDescription;
        this.requestedModerator = requestedModerator;
    }

    // Getters and Setters
    /**
     * Gets the id.
     * @return the id
     */
    public Long getId() { return id; }
    /**
     * Sets the id.
     * @param id the new value
     */
    public void setId(Long id) { this.id = id; }
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
     * Gets the role.
     * @return the role
     */

    public String getRole() { return role; }
    /**
     * Sets the role.
     * @param role the new value
     */
    public void setRole(String role) { this.role = role; }
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
     * Gets the requestedModerator.
     * @return the requestedModerator
     */

    public Boolean getRequestedModerator() { return requestedModerator; }
    /**
     * Sets the requestedModerator.
     * @param requestedModerator the new value
     */
    public void setRequestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; }

    // Manual Builder
    /**
     * Creates a new builder instance.
     * @return the builder
     */
    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public static class UserResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String address;
        private String phone;
        private String location;
        private String storeDescription;
        private Boolean requestedModerator;
        /**
         * Sets the id field for the builder.
         * @param id the value to set
         * @return the builder instance
         */

        public UserResponseBuilder id(Long id) { this.id = id; return this; }
        /**
         * Sets the name field for the builder.
         * @param name the value to set
         * @return the builder instance
         */
        public UserResponseBuilder name(String name) { this.name = name; return this; }
        /**
         * Sets the email field for the builder.
         * @param email the value to set
         * @return the builder instance
         */
        public UserResponseBuilder email(String email) { this.email = email; return this; }
        /**
         * Sets the role field for the builder.
         * @param role the value to set
         * @return the builder instance
         */
        public UserResponseBuilder role(String role) { this.role = role; return this; }
        /**
         * Sets the address field for the builder.
         * @param address the value to set
         * @return the builder instance
         */
        public UserResponseBuilder address(String address) { this.address = address; return this; }
        public UserResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public UserResponseBuilder location(String location) { this.location = location; return this; }
        public UserResponseBuilder storeDescription(String storeDescription) { this.storeDescription = storeDescription; return this; }
        public UserResponseBuilder requestedModerator(Boolean requestedModerator) { this.requestedModerator = requestedModerator; return this; }

        public UserResponse build() {
            return new UserResponse(id, name, email, role, address, phone, location, storeDescription, requestedModerator);
        }
    }
}
