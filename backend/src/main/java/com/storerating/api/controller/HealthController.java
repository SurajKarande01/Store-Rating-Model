package com.storerating.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
/**
 * Represents the HealthController class.
 */

@RestController
@RequestMapping("/api/health")
public class HealthController {
    /**
     * Executes the healthCheck operation.
     */

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }
}
