package com.storerating.api.controller;

import com.storerating.api.dto.*;
import com.storerating.api.entity.Role;
import com.storerating.api.entity.Store;
import com.storerating.api.entity.User;
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
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

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
        String filterEmail = (filterEmail = (email != null && !email.trim().isEmpty()) ? email.trim() : null);
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
                .build();

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
                .owner(owner)
                .build();

        Store savedStore = storeRepository.save(store);

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
