package com.storerating.api.controller;

import com.storerating.api.dto.RaterRatingResponse;
import com.storerating.api.dto.StoreOwnerDashboardResponse;
import com.storerating.api.entity.Rating;
import com.storerating.api.entity.Store;
import com.storerating.api.repository.RatingRepository;
import com.storerating.api.repository.StoreRepository;
import com.storerating.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/store-owner")
public class StoreOwnerController {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getOwnerDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long ownerId = userPrincipal.getId();

        // Get stores owned by this user
        List<Store> stores = storeRepository.findByOwnerId(ownerId);

        if (stores.isEmpty()) {
            return ResponseEntity.ok(StoreOwnerDashboardResponse.builder()
                    .stores(new ArrayList<>())
                    .averageRating("0.0")
                    .totalRatings(0L)
                    .raters(new ArrayList<>())
                    .build());
        }

        List<Long> storeIds = stores.stream().map(Store::getId).collect(Collectors.toList());

        // Get average rating across owned stores
        Double avgRating = ratingRepository.getAverageRatingForStores(storeIds);
        String formattedAvg = String.format(Locale.US, "%.1f", avgRating);

        // Get total ratings count
        Long totalRatings = ratingRepository.countRatingsForStores(storeIds);

        // Get list of raters
        List<Rating> ratings = ratingRepository.findByStoreIdInOrderByCreatedAtDesc(storeIds);
        List<RaterRatingResponse> raters = ratings.stream().map(r -> RaterRatingResponse.builder()
                .id(r.getUser().getId())
                .name(r.getUser().getName())
                .email(r.getUser().getEmail())
                .rating(r.getRating())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .storeName(r.getStore().getName())
                .build()
        ).collect(Collectors.toList());

        return ResponseEntity.ok(StoreOwnerDashboardResponse.builder()
                .stores(stores)
                .averageRating(formattedAvg)
                .totalRatings(totalRatings)
                .raters(raters)
                .build());
    }
}
