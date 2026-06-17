package com.storerating.api.dto;
/**
 * Represents the DashboardStatsResponse class.
 */

public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalStores;
    private Long totalRatings;

    // Constructors
    /**
     * Constructs a new DashboardStatsResponse.
     */
    public DashboardStatsResponse() {}
    /**
     * Constructs a new DashboardStatsResponse.
     */

    public DashboardStatsResponse(Long totalUsers, Long totalStores, Long totalRatings) {
        this.totalUsers = totalUsers;
        this.totalStores = totalStores;
        this.totalRatings = totalRatings;
    }

    // Getters and Setters
    /**
     * Gets the totalUsers.
     * @return the totalUsers
     */
    public Long getTotalUsers() { return totalUsers; }
    /**
     * Sets the totalUsers.
     * @param totalUsers the new value
     */
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
    /**
     * Gets the totalStores.
     * @return the totalStores
     */

    public Long getTotalStores() { return totalStores; }
    /**
     * Sets the totalStores.
     * @param totalStores the new value
     */
    public void setTotalStores(Long totalStores) { this.totalStores = totalStores; }
    /**
     * Gets the totalRatings.
     * @return the totalRatings
     */

    public Long getTotalRatings() { return totalRatings; }
    /**
     * Sets the totalRatings.
     * @param totalRatings the new value
     */
    public void setTotalRatings(Long totalRatings) { this.totalRatings = totalRatings; }

    // Manual Builder
    /**
     * Creates a new builder instance.
     * @return the builder
     */
    public static DashboardStatsResponseBuilder builder() {
        return new DashboardStatsResponseBuilder();
    }

    public static class DashboardStatsResponseBuilder {
        private Long totalUsers;
        private Long totalStores;
        private Long totalRatings;
        /**
         * Sets the totalUsers field for the builder.
         * @param totalUsers the value to set
         * @return the builder instance
         */

        public DashboardStatsResponseBuilder totalUsers(Long totalUsers) { this.totalUsers = totalUsers; return this; }
        /**
         * Sets the totalStores field for the builder.
         * @param totalStores the value to set
         * @return the builder instance
         */
        public DashboardStatsResponseBuilder totalStores(Long totalStores) { this.totalStores = totalStores; return this; }
        /**
         * Sets the totalRatings field for the builder.
         * @param totalRatings the value to set
         * @return the builder instance
         */
        public DashboardStatsResponseBuilder totalRatings(Long totalRatings) { this.totalRatings = totalRatings; return this; }
        /**
         * Builds and returns the instance.
         * @return the built instance
         */

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalUsers, totalStores, totalRatings);
        }
    }
}
