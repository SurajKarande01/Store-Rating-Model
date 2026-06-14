package com.storerating.api.controller;

import com.storerating.api.dto.ChangePasswordRequest;
import com.storerating.api.entity.User;
import com.storerating.api.entity.Store;
import com.storerating.api.entity.Activity;
import com.storerating.api.entity.Role;
import com.storerating.api.repository.UserRepository;
import com.storerating.api.repository.StoreRepository;
import com.storerating.api.repository.ActivityRepository;
import com.storerating.api.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request) {

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Current password is incorrect.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(user.getId())
                .userName(user.getName())
                .action("CHANGE_PASSWORD")
                .details(user.getName() + " changed password.")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body) {

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String name = body.get("name");
        String email = body.get("email");
        String phone = body.get("phone");
        String location = body.get("location");
        String address = body.get("address");
        String storeDescription = body.get("storeDescription");

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }
        if (email != null && !email.trim().isEmpty()) {
            // Check if email already exists for another user
            if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(email)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email already registered by another user.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            user.setEmail(email);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        if (location != null) {
            user.setLocation(location);
        }
        if (address != null) {
            user.setAddress(address);
        }
        if (storeDescription != null) {
            user.setStoreDescription(storeDescription);
        }

        userRepository.save(user);

        // If store owner, update store details
        if (user.getRole() == Role.store_owner) {
            List<Store> stores = storeRepository.findByOwnerId(user.getId());
            for (Store store : stores) {
                if (name != null && !name.trim().isEmpty()) {
                    store.setName(user.getName() + "'s Store");
                }
                if (email != null && !email.trim().isEmpty()) {
                    store.setEmail(user.getEmail());
                }
                if (location != null || address != null) {
                    store.setAddress(user.getLocation() != null && !user.getLocation().isEmpty() ? user.getLocation() : user.getAddress());
                }
                if (storeDescription != null) {
                    store.setDescription(user.getStoreDescription());
                }
                storeRepository.save(store);
            }
        }

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(user.getId())
                .userName(user.getName())
                .action("UPDATE_PROFILE")
                .details(user.getName() + " updated profile.")
                .build());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully.");
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/request-moderator")
    public ResponseEntity<?> requestModerator(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.user) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Only Simple Users can request Moderator upgrade.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        user.setRequestedModerator(true);
        userRepository.save(user);

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(user.getId())
                .userName(user.getName())
                .action("REQUESTED_MODERATOR")
                .details(user.getName() + " requested upgrade to Moderator.")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Upgrade request sent to administrator successfully.");
        return ResponseEntity.ok(response);
    }
}
