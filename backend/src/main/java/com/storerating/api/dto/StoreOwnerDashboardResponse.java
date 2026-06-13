package com.storerating.api.dto;

import com.storerating.api.entity.Store;
import java.util.List;

public class StoreOwnerDashboardResponse {
    private List<Store> stores;
    private String averageRating;
    private Long totalRatings;
    private List<RaterRatingResponse> raters;

    // Constructors
    public StoreOwnerDashboardResponse() {}

    public StoreOwnerDashboardResponse(List<Store> stores, String averageRating, Long totalRatings, List<RaterRatingResponse> raters) {
        this.stores = stores;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
        this.raters = raters;
    }

    // Getters and Setters
    public List<Store> getStores() { return stores; }
    public void setStores(List<Store> stores) { this.stores = stores; }

    public String getAverageRating() { return averageRating; }
    public void setAverageRating(String averageRating) { this.averageRating = averageRating; }

    public Long getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Long totalRatings) { this.totalRatings = totalRatings; }

    public List<RaterRatingResponse> getRaters() { return raters; }
    public void setRaters(List<RaterRatingResponse> raters) { this.raters = raters; }

    // Manual Builder
    public static StoreOwnerDashboardResponseBuilder builder() {
        return new StoreOwnerDashboardResponseBuilder();
    }

    public static class StoreOwnerDashboardResponseBuilder {
        private List<Store> stores;
        private String averageRating;
        private Long totalRatings;
        private List<RaterRatingResponse> raters;

        public StoreOwnerDashboardResponseBuilder stores(List<Store> stores) { this.stores = stores; return this; }
        public StoreOwnerDashboardResponseBuilder averageRating(String averageRating) { this.averageRating = averageRating; return this; }
        public StoreOwnerDashboardResponseBuilder totalRatings(Long totalRatings) { this.totalRatings = totalRatings; return this; }
        public StoreOwnerDashboardResponseBuilder raters(List<RaterRatingResponse> raters) { this.raters = raters; return this; }

        public StoreOwnerDashboardResponse build() {
            return new StoreOwnerDashboardResponse(stores, averageRating, totalRatings, raters);
        }
    }
}
