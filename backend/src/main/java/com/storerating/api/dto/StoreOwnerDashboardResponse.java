package com.storerating.api.dto;

import com.storerating.api.entity.Store;
import java.util.List;
/**
 * Represents the StoreOwnerDashboardResponse class.
 */

public class StoreOwnerDashboardResponse {
    private List<Store> stores;
    private String averageRating;
    private Long totalRatings;
    private List<RaterRatingResponse> raters;

    // Constructors
    /**
     * Constructs a new StoreOwnerDashboardResponse.
     */
    public StoreOwnerDashboardResponse() {}
    /**
     * Constructs a new StoreOwnerDashboardResponse.
     */

    public StoreOwnerDashboardResponse(List<Store> stores, String averageRating, Long totalRatings, List<RaterRatingResponse> raters) {
        this.stores = stores;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
        this.raters = raters;
    }

    // Getters and Setters
    /**
     * Gets the stores.
     * @return the stores
     */
    public List<Store> getStores() { return stores; }
    /**
     * Sets the stores.
     * @param stores the new value
     */
    public void setStores(List<Store> stores) { this.stores = stores; }
    /**
     * Gets the averageRating.
     * @return the averageRating
     */

    public String getAverageRating() { return averageRating; }
    /**
     * Sets the averageRating.
     * @param averageRating the new value
     */
    public void setAverageRating(String averageRating) { this.averageRating = averageRating; }
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
    /**
     * Gets the raters.
     * @return the raters
     */

    public List<RaterRatingResponse> getRaters() { return raters; }
    /**
     * Sets the raters.
     * @param raters the new value
     */
    public void setRaters(List<RaterRatingResponse> raters) { this.raters = raters; }

    // Manual Builder
    /**
     * Creates a new builder instance.
     * @return the builder
     */
    public static StoreOwnerDashboardResponseBuilder builder() {
        return new StoreOwnerDashboardResponseBuilder();
    }

    public static class StoreOwnerDashboardResponseBuilder {
        private List<Store> stores;
        private String averageRating;
        private Long totalRatings;
        private List<RaterRatingResponse> raters;
        /**
         * Sets the stores field for the builder.
         * @param stores the value to set
         * @return the builder instance
         */

        public StoreOwnerDashboardResponseBuilder stores(List<Store> stores) { this.stores = stores; return this; }
        /**
         * Sets the averageRating field for the builder.
         * @param averageRating the value to set
         * @return the builder instance
         */
        public StoreOwnerDashboardResponseBuilder averageRating(String averageRating) { this.averageRating = averageRating; return this; }
        /**
         * Sets the totalRatings field for the builder.
         * @param totalRatings the value to set
         * @return the builder instance
         */
        public StoreOwnerDashboardResponseBuilder totalRatings(Long totalRatings) { this.totalRatings = totalRatings; return this; }
        /**
         * Sets the raters field for the builder.
         * @param raters the value to set
         * @return the builder instance
         */
        public StoreOwnerDashboardResponseBuilder raters(List<RaterRatingResponse> raters) { this.raters = raters; return this; }
        /**
         * Builds and returns the instance.
         * @return the built instance
         */

        public StoreOwnerDashboardResponse build() {
            return new StoreOwnerDashboardResponse(stores, averageRating, totalRatings, raters);
        }
    }
}
