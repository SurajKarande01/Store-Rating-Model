package com.storerating.api.controller;

import com.storerating.api.repository.StoreProjection;
import com.storerating.api.repository.StoreRepository;
import com.storerating.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @GetMapping
    public ResponseEntity<List<StoreProjection>> getAllStores(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        // Set search wildcards for SQL LIKE
        String searchName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String searchAddress = (address != null && !address.trim().isEmpty()) ? address.trim() : null;

        List<StoreProjection> stores = new ArrayList<>(
                storeRepository.findAllStoresWithUserRating(userPrincipal.getId(), searchName, searchAddress)
        );

        // Sorting logic matching Express.js
        String finalSortBy = (sortBy != null) ? sortBy : "name";
        String finalSortOrder = (sortOrder != null) ? sortOrder : "desc";
        boolean isAsc = "asc".equalsIgnoreCase(finalSortOrder);

        stores.sort((s1, s2) -> {
            int comp;
            switch (finalSortBy) {
                case "overallRating":
                    comp = Double.compare(s1.getOverallRating(), s2.getOverallRating());
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
