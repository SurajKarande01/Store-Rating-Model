package com.storerating.api.controller;

import com.storerating.api.dto.*;
import com.storerating.api.entity.*;
import com.storerating.api.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboard() {
        long totalUsers = userRepository.count();
        long totalStores = storeRepository.count();
        long totalRatings = ratingRepository.count();

        return ResponseEntity.ok(DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalStores(totalStores)
                .totalRatings(totalRatings)
                .build());
    }

    @GetMapping("/activities")
    public ResponseEntity<List<Activity>> getActivities() {
        return ResponseEntity.ok(activityRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email already registered.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toLowerCase());
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid role specified.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress() != null ? request.getAddress() : "")
                .phone("")
                .location("")
                .storeDescription("")
                .role(role)
                .requestedModerator(false)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create store if role is store_owner
        if (role == Role.store_owner) {
            Store store = Store.builder()
                    .name(savedUser.getName() + "'s Store")
                    .email(savedUser.getEmail())
                    .address(savedUser.getAddress())
                    .description("")
                    .owner(savedUser)
                    .build();
            storeRepository.save(store);
        }

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(savedUser.getId())
                .userName(savedUser.getName())
                .action("CREATE_USER")
                .details("Admin created user: " + savedUser.getName() + " with role " + savedUser.getRole().name())
                .build());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User created successfully.");
        response.put("userId", savedUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        String filterName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String filterEmail = (email != null && !email.trim().isEmpty()) ? email.trim() : null;
        String filterAddress = (address != null && !address.trim().isEmpty()) ? address.trim() : null;

        Role filterRole = null;
        if (role != null && !role.trim().isEmpty()) {
            try {
                filterRole = Role.valueOf(role.trim().toLowerCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid role
            }
        }

        List<User> users = new ArrayList<>(
                userRepository.findAllFiltered(filterName, filterEmail, filterAddress, filterRole)
        );

        // Sorting
        String finalSortBy = (sortBy != null) ? sortBy : "createdAt";
        String finalSortOrder = (sortOrder != null) ? sortOrder : "desc";
        boolean isAsc = "asc".equalsIgnoreCase(finalSortOrder);

        users.sort((u1, u2) -> {
            int comp;
            switch (finalSortBy.toLowerCase()) {
                case "name":
                    comp = u1.getName().compareToIgnoreCase(u2.getName());
                    break;
                case "email":
                    comp = u1.getEmail().compareToIgnoreCase(u2.getEmail());
                    break;
                case "address":
                    String a1 = u1.getAddress() != null ? u1.getAddress() : "";
                    String a2 = u2.getAddress() != null ? u2.getAddress() : "";
                    comp = a1.compareToIgnoreCase(a2);
                    break;
                case "role":
                    comp = u1.getRole().name().compareToIgnoreCase(u2.getRole().name());
                    break;
                default: // created_at / createdAt
                    comp = u1.getCreatedAt().compareTo(u2.getCreatedAt());
                    break;
            }
            return isAsc ? comp : -comp;
        });

        // Map to response
        List<AdminUserResponse> responseList = users.stream().map(u -> {
            Double avgRating = null;
            if (u.getRole() == Role.store_owner) {
                List<Store> ownedStores = storeRepository.findByOwnerId(u.getId());
                if (!ownedStores.isEmpty()) {
                    List<Long> storeIds = ownedStores.stream().map(Store::getId).collect(Collectors.toList());
                    avgRating = ratingRepository.getAverageRatingForStores(storeIds);
                } else {
                    avgRating = 0.0;
                }
            }

            return AdminUserResponse.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .address(u.getAddress())
                    .role(u.getRole().name())
                    .createdAt(u.getCreatedAt())
                    .rating(avgRating)
                    .phone(u.getPhone())
                    .location(u.getLocation())
                    .storeDescription(u.getStoreDescription())
                    .requestedModerator(u.getRequestedModerator())
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        User u = userOpt.get();

        Double overallRating = null;
        List<AdminUserDetailResponse.StoreRatingInfo> storesList = new ArrayList<>();

        if (u.getRole() == Role.store_owner) {
            List<Store> ownedStores = storeRepository.findByOwnerId(u.getId());
            if (!ownedStores.isEmpty()) {
                List<Long> storeIds = ownedStores.stream().map(Store::getId).collect(Collectors.toList());
                overallRating = ratingRepository.getAverageRatingForStores(storeIds);

                for (Store s : ownedStores) {
                    Double sAvg = ratingRepository.getAverageRatingForStores(Collections.singletonList(s.getId()));
                    storesList.add(AdminUserDetailResponse.StoreRatingInfo.builder()
                            .id(s.getId())
                            .name(s.getName())
                            .averageRating(sAvg)
                            .build());
                }
            } else {
                overallRating = 0.0;
            }
        }

        AdminUserDetailResponse response = AdminUserDetailResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .address(u.getAddress())
                .role(u.getRole().name())
                .createdAt(u.getCreatedAt())
                .rating(overallRating)
                .stores(storesList)
                .phone(u.getPhone())
                .location(u.getLocation())
                .storeDescription(u.getStoreDescription())
                .requestedModerator(u.getRequestedModerator())
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/promote-moderator")
    public ResponseEntity<?> promoteModerator(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.user && user.getRole() != Role.moderator) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Only Simple Users or existing Moderators can be promoted.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        user.setRole(Role.moderator);
        user.setRequestedModerator(false);
        userRepository.save(user);

        // Log activity
        activityRepository.save(Activity.builder()
                .action("PROMOTED_TO_MODERATOR")
                .details("Admin promoted user '" + user.getName() + "' to Moderator role.")
                .userId(user.getId())
                .userName(user.getName())
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "User promoted to Moderator successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/demote-moderator")
    public ResponseEntity<?> demoteModerator(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.moderator) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User is not a Moderator.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        user.setRole(Role.user);
        user.setRequestedModerator(false);
        userRepository.save(user);

        // Log activity
        activityRepository.save(Activity.builder()
                .action("DEMOTED_FROM_MODERATOR")
                .details("Admin demoted user '" + user.getName() + "' back to Simple User role.")
                .userId(user.getId())
                .userName(user.getName())
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Moderator demoted to Simple User successfully.");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.admin) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cannot delete an administrator account.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Delete user stores (if store owner)
        if (user.getRole() == Role.store_owner) {
            List<Store> ownedStores = storeRepository.findByOwnerId(user.getId());
            for (Store s : ownedStores) {
                storeRepository.delete(s);
            }
        }

        userRepository.delete(user);

        // Log activity
        activityRepository.save(Activity.builder()
                .action("DELETED_USER")
                .details("Admin deleted user account: " + user.getName() + " (" + user.getEmail() + ")")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "User account deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        ratingRepository.delete(rating);

        // Log activity
        activityRepository.save(Activity.builder()
                .action("DELETED_REVIEW")
                .details("Admin deleted review by " + rating.getUser().getName() + " for store '" + rating.getStore().getName() + "'.")
                .build());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Review deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stores")
    public ResponseEntity<?> createStore(@Valid @RequestBody CreateStoreRequest request) {
        if (storeRepository.existsByEmail(request.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Store email already registered.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        User owner = null;
        if (request.getOwnerId() != null) {
            Optional<User> ownerOpt = userRepository.findById(request.getOwnerId());
            if (ownerOpt.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Owner user not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            owner = ownerOpt.get();
            if (owner.getRole() != Role.store_owner) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Selected user is not a store owner.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }

        Store store = Store.builder()
                .name(request.getName())
                .email(request.getEmail())
                .address(request.getAddress() != null ? request.getAddress() : "")
                .description("")
                .owner(owner)
                .build();

        Store savedStore = storeRepository.save(store);

        // Log activity
        activityRepository.save(Activity.builder()
                .action("CREATE_STORE")
                .details("Admin created store: " + savedStore.getName() + " owned by " + (owner != null ? owner.getName() : "None"))
                .build());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Store created successfully.");
        response.put("storeId", savedStore.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/stores")
    public ResponseEntity<List<AdminStoreProjection>> getStores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        String filterName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String filterEmail = (email != null && !email.trim().isEmpty()) ? email.trim() : null;
        String filterAddress = (address != null && !address.trim().isEmpty()) ? address.trim() : null;

        List<AdminStoreProjection> stores = new ArrayList<>(
                storeRepository.findAllStoresForAdmin(filterName, filterEmail, filterAddress)
        );

        // Sorting
        String finalSortBy = (sortBy != null) ? sortBy : "name";
        String finalSortOrder = (sortOrder != null) ? sortOrder : "desc";
        boolean isAsc = "asc".equalsIgnoreCase(finalSortOrder);

        stores.sort((s1, s2) -> {
            int comp;
            switch (finalSortBy.toLowerCase()) {
                case "rating":
                    comp = Double.compare(s1.getRating(), s2.getRating());
                    break;
                case "email":
                    comp = s1.getEmail().compareToIgnoreCase(s2.getEmail());
                    break;
                case "address":
                    String a1 = s1.getAddress() != null ? s1.getAddress() : "";
                    String a2 = s2.getAddress() != null ? s2.getAddress() : "";
                    comp = a1.compareToIgnoreCase(a2);
                    break;
                default: // name
                    comp = s1.getName().compareToIgnoreCase(s2.getName());
                    break;
            }
            return isAsc ? comp : -comp;
        });

        return ResponseEntity.ok(stores);
    }
}
