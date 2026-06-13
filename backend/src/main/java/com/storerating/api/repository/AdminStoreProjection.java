package com.storerating.api.repository;

public interface AdminStoreProjection {
    Long getId();
    String getName();
    String getEmail();
    String getAddress();
    Long getOwnerId();
    Double getRating();
    Long getRatingCount();
}
