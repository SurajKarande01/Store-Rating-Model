package com.storerating.api.repository;

public interface StoreProjection {
    Long getId();
    String getName();
    String getEmail();
    String getAddress();
    Double getOverallRating();
    Long getTotalRatings();
    Integer getUserRating();
    Long getUserRatingId();
}
