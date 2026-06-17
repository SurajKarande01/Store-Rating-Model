package com.storerating.api.controller;

import com.storerating.api.entity.User;
import com.storerating.api.entity.Store;
import com.storerating.api.entity.Rating;
import com.storerating.api.entity.Activity;
import com.storerating.api.entity.Role;
import com.storerating.api.repository.UserRepository;
import com.storerating.api.repository.StoreRepository;
import com.storerating.api.repository.RatingRepository;
import com.storerating.api.repository.ActivityRepository;
import com.storerating.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * Represents the ModeratorController class.
 */

@RestController
@RequestMapping("/api/moderator")
public class ModeratorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private ActivityRepository activityRepository;
    /**
     * Executes the Deletes user operation.
     */

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Moderator can only delete Simple Users (user) and Store Owners (store_owner)
        if (targetUser.getRole() != Role.user && targetUser.getRole() != Role.store_owner) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Moderators are not authorized to delete this type of user.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        // Delete store if owner
        if (targetUser.getRole() == Role.store_owner) {
            List<Store> ownedStores = storeRepository.findByOwnerId(targetUser.getId());
            for (Store s : ownedStores) {
                storeRepository.delete(s);
            }
        }

        userRepository.delete(targetUser);

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(userPrincipal.getId())
                .userName(userPrincipal.getName())
                .action("MODERATOR_DELETED_USER")
                .details("Moderator " + userPrincipal.getName() + " deleted user account: " + targetUser.getName() + " (" + targetUser.getEmail() + ")")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "User account deleted successfully by moderator.");
        return ResponseEntity.ok(response);
    }
    /**
     * Executes the Deletes review operation.
     */

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        ratingRepository.delete(rating);

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(userPrincipal.getId())
                .userName(userPrincipal.getName())
                .action("MODERATOR_DELETED_REVIEW")
                .details("Moderator " + userPrincipal.getName() + " deleted review by " + rating.getUser().getName() + " for store '" + rating.getStore().getName() + "'.")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Review deleted successfully by moderator.");
        return ResponseEntity.ok(response);
    }
}
