package com.storerating.api.controller;

import com.storerating.api.dto.RaterRatingResponse;
import com.storerating.api.dto.StoreOwnerDashboardResponse;
import com.storerating.api.entity.Rating;
import com.storerating.api.entity.Store;
import com.storerating.api.entity.Activity;
import com.storerating.api.repository.RatingRepository;
import com.storerating.api.repository.StoreRepository;
import com.storerating.api.repository.ActivityRepository;
import com.storerating.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
/**
 * Represents the StoreOwnerController class.
 */

@RestController
@RequestMapping("/api/store-owner")
public class StoreOwnerController {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private ActivityRepository activityRepository;
    /**
     * Gets the ownerDashboard.
     * @return the ownerDashboard
     */

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

        // Get list of raters ordered by pinned status first, then by creation date
        List<Rating> ratings = ratingRepository.findByStoreIdInOrderByPinnedDescCreatedAtDesc(storeIds);
        List<RaterRatingResponse> raters = ratings.stream().map(r -> RaterRatingResponse.builder()
                .id(r.getUser().getId())
                .ratingId(r.getId())
                .name(r.getUser().getName())
                .email(r.getUser().getEmail())
                .rating(r.getRating())
                .comment(r.getComment())
                .pinned(r.getPinned())
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
    /**
     * Executes the updateStoreImage operation.
     */

    @PutMapping("/store/image")
    public ResponseEntity<?> updateStoreImage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        List<Store> stores = storeRepository.findByOwnerId(userPrincipal.getId());
        if (stores.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No store found for this owner.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        for (Store store : stores) {
            store.setImageUrl(imageUrl);
            storeRepository.save(store);
        }

        activityRepository.save(Activity.builder()
                .userId(userPrincipal.getId())
                .userName(userPrincipal.getName())
                .action("UPDATE_STORE_IMAGE")
                .details(userPrincipal.getName() + " updated store image.")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Store image updated successfully.");
        return ResponseEntity.ok(response);
    }
    /**
     * Executes the togglePinRating operation.
     */

    @PutMapping("/ratings/{id}/pin")
    public ResponseEntity<?> togglePinRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        // Check if the store owner owns the store of this rating
        List<Store> ownedStores = storeRepository.findByOwnerId(userPrincipal.getId());
        boolean ownsStore = ownedStores.stream().anyMatch(s -> s.getId().equals(rating.getStore().getId()));

        if (!ownsStore) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "You are not authorized to pin this rating.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        rating.setPinned(!rating.getPinned());
        ratingRepository.save(rating);

        activityRepository.save(Activity.builder()
                .userId(userPrincipal.getId())
                .userName(userPrincipal.getName())
                .action(rating.getPinned() ? "PIN_RATING" : "UNPIN_RATING")
                .details(userPrincipal.getName() + (rating.getPinned() ? " pinned " : " unpinned ") + "rating by " + rating.getUser().getName())
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Rating pinned status updated successfully.");
        return ResponseEntity.ok(response);
    }
}
