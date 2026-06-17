package com.storerating.api.controller;

import com.storerating.api.dto.RatingRequest;
import com.storerating.api.entity.Rating;
import com.storerating.api.entity.Store;
import com.storerating.api.entity.User;
import com.storerating.api.entity.Activity;
import com.storerating.api.repository.RatingRepository;
import com.storerating.api.repository.StoreRepository;
import com.storerating.api.repository.UserRepository;
import com.storerating.api.repository.ActivityRepository;
import com.storerating.api.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
/**
 * Represents the RatingController class.
 */

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;
    /**
     * Executes the submitRating operation.
     */

    @PostMapping
    public ResponseEntity<?> submitRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody RatingRequest request) {

        Optional<Store> storeOpt = storeRepository.findById(request.getStoreId());
        if (storeOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Store not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Check if user already rated this store
        Optional<Rating> existingOpt = ratingRepository.findByUserIdAndStoreId(userPrincipal.getId(), request.getStoreId());
        if (existingOpt.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "You have already rated this store. Use update instead.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = Rating.builder()
                .user(user)
                .store(storeOpt.get())
                .rating(request.getRating())
                .comment(request.getComment() != null ? request.getComment() : "")
                .pinned(false)
                .build();

        Rating savedRating = ratingRepository.save(rating);

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(user.getId())
                .userName(user.getName())
                .action("SUBMIT_RATING")
                .details(user.getName() + " rated store '" + storeOpt.get().getName() + "' as " + request.getRating() + " stars.")
                .build());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Rating submitted successfully.");
        response.put("ratingId", savedRating.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    /**
     * Executes the updateRating operation.
     */

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        Object ratingObj = body.get("rating");
        if (ratingObj == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Rating value is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        int ratingValue;
        try {
            ratingValue = Integer.parseInt(ratingObj.toString());
        } catch (NumberFormatException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Rating must be a valid number.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (ratingValue < 1 || ratingValue > 5) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Rating must be between 1 and 5.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<Rating> ratingOpt = ratingRepository.findByIdAndUserId(id, userPrincipal.getId());
        if (ratingOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Rating not found or not authorized.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Rating rating = ratingOpt.get();
        rating.setRating(ratingValue);
        
        Object commentObj = body.get("comment");
        if (commentObj != null) {
            rating.setComment(commentObj.toString());
        }
        
        ratingRepository.save(rating);

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(userPrincipal.getId())
                .userName(userPrincipal.getName())
                .action("UPDATE_RATING")
                .details(userPrincipal.getName() + " updated rating for '" + rating.getStore().getName() + "' to " + ratingValue + " stars.")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Rating updated successfully.");
        return ResponseEntity.ok(response);
    }
    /**
     * Executes the Deletes rating operation.
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        boolean isOwn = rating.getUser().getId().equals(userPrincipal.getId());
        boolean isAdmin = userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));
        boolean isModerator = userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_moderator"));

        if (!isOwn && !isAdmin && !isModerator) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "You are not authorized to delete this rating.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        ratingRepository.delete(rating);

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(userPrincipal.getId())
                .userName(userPrincipal.getName())
                .action("DELETE_RATING")
                .details(userPrincipal.getName() + " deleted review by " + rating.getUser().getName() + " for store '" + rating.getStore().getName() + "'.")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Review deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
