package com.storerating.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
/**
 * Represents the Activity class.
 */

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(nullable = false)
    private String action;

    @Column(length = 1000)
    private String details;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    /**
     * Constructs a new Activity.
     */
    public Activity() {}
    /**
     * Constructs a new Activity.
     */

    public Activity(Long id, Long userId, String userName, String action, String details, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.action = action;
        this.details = details;
        this.createdAt = createdAt;
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
     * Gets the userId.
     * @return the userId
     */

    public Long getUserId() { return userId; }
    /**
     * Sets the userId.
     * @param userId the new value
     */
    public void setUserId(Long userId) { this.userId = userId; }
    /**
     * Gets the userName.
     * @return the userName
     */

    public String getUserName() { return userName; }
    /**
     * Sets the userName.
     * @param userName the new value
     */
    public void setUserName(String userName) { this.userName = userName; }
    /**
     * Gets the action.
     * @return the action
     */

    public String getAction() { return action; }
    /**
     * Sets the action.
     * @param action the new value
     */
    public void setAction(String action) { this.action = action; }
    /**
     * Gets the details.
     * @return the details
     */

    public String getDetails() { return details; }
    /**
     * Sets the details.
     * @param details the new value
     */
    public void setDetails(String details) { this.details = details; }
    /**
     * Gets the createdAt.
     * @return the createdAt
     */

    public LocalDateTime getCreatedAt() { return createdAt; }
    /**
     * Sets the createdAt.
     * @param createdAt the new value
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Manual Builder
    /**
     * Creates a new builder instance.
     * @return the builder
     */
    public static ActivityBuilder builder() {
        return new ActivityBuilder();
    }

    public static class ActivityBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private String action;
        private String details;
        private LocalDateTime createdAt;
        /**
         * Sets the id field for the builder.
         * @param id the value to set
         * @return the builder instance
         */

        public ActivityBuilder id(Long id) { this.id = id; return this; }
        /**
         * Sets the userId field for the builder.
         * @param userId the value to set
         * @return the builder instance
         */
        public ActivityBuilder userId(Long userId) { this.userId = userId; return this; }
        /**
         * Sets the userName field for the builder.
         * @param userName the value to set
         * @return the builder instance
         */
        public ActivityBuilder userName(String userName) { this.userName = userName; return this; }
        /**
         * Sets the action field for the builder.
         * @param action the value to set
         * @return the builder instance
         */
        public ActivityBuilder action(String action) { this.action = action; return this; }
        /**
         * Sets the details field for the builder.
         * @param details the value to set
         * @return the builder instance
         */
        public ActivityBuilder details(String details) { this.details = details; return this; }
        /**
         * Sets the createdAt field for the builder.
         * @param createdAt the value to set
         * @return the builder instance
         */
        public ActivityBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Activity build() {
            return new Activity(id, userId, userName, action, details, createdAt);
        }
    }
}
