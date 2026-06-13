package com.storerating.api.dto;

public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalStores;
    private Long totalRatings;

    // Constructors
    public DashboardStatsResponse() {}

    public DashboardStatsResponse(Long totalUsers, Long totalStores, Long totalRatings) {
        this.totalUsers = totalUsers;
        this.totalStores = totalStores;
        this.totalRatings = totalRatings;
    }

    // Getters and Setters
    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalStores() { return totalStores; }
    public void setTotalStores(Long totalStores) { this.totalStores = totalStores; }

    public Long getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Long totalRatings) { this.totalRatings = totalRatings; }

    // Manual Builder
    public static DashboardStatsResponseBuilder builder() {
        return new DashboardStatsResponseBuilder();
    }

    public static class DashboardStatsResponseBuilder {
        private Long totalUsers;
        private Long totalStores;
        private Long totalRatings;

        public DashboardStatsResponseBuilder totalUsers(Long totalUsers) { this.totalUsers = totalUsers; return this; }
        public DashboardStatsResponseBuilder totalStores(Long totalStores) { this.totalStores = totalStores; return this; }
        public DashboardStatsResponseBuilder totalRatings(Long totalRatings) { this.totalRatings = totalRatings; return this; }

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalUsers, totalStores, totalRatings);
        }
    }
}
