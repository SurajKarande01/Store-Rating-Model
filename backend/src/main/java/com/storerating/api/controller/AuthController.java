package com.storerating.api.controller;

import com.storerating.api.dto.JwtAuthenticationResponse;
import com.storerating.api.dto.LoginRequest;
import com.storerating.api.dto.SignupRequest;
import com.storerating.api.dto.UserResponse;
import com.storerating.api.entity.Role;
import com.storerating.api.entity.User;
import com.storerating.api.entity.Store;
import com.storerating.api.entity.Activity;
import com.storerating.api.repository.UserRepository;
import com.storerating.api.repository.StoreRepository;
import com.storerating.api.repository.ActivityRepository;
import com.storerating.api.security.JwtTokenProvider;
import com.storerating.api.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
/**
 * Represents the AuthController class.
 */

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;
    /**
     * Executes the signup operation.
     */

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email already registered.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Role role = Role.user;
        if (signupRequest.getRole() != null) {
            try {
                role = Role.valueOf(signupRequest.getRole().toLowerCase());
            } catch (IllegalArgumentException e) {
                // keep Role.user
            }
        }

        User user = User.builder()
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .passwordHash(passwordEncoder.encode(signupRequest.getPassword()))
                .address(signupRequest.getAddress() != null ? signupRequest.getAddress() : "")
                .phone(signupRequest.getPhone() != null ? signupRequest.getPhone() : "")
                .location(signupRequest.getLocation() != null ? signupRequest.getLocation() : "")
                .storeDescription(signupRequest.getStoreDescription() != null ? signupRequest.getStoreDescription() : "")
                .role(role)
                .requestedModerator(false)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create store if role is store_owner
        if (role == Role.store_owner) {
            Store store = Store.builder()
                    .name(savedUser.getName() + "'s Store")
                    .email(savedUser.getEmail())
                    .address(savedUser.getLocation() != null && !savedUser.getLocation().isEmpty() ? savedUser.getLocation() : savedUser.getAddress())
                    .description(savedUser.getStoreDescription())
                    .owner(savedUser)
                    .build();
            storeRepository.save(store);
        }

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(savedUser.getId())
                .userName(savedUser.getName())
                .action("SIGNUP")
                .details(savedUser.getName() + " signed up as " + savedUser.getRole().name())
                .build());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully.");
        response.put("userId", savedUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    /**
     * Executes the login operation.
     */

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId()).orElse(null);
        
        UserResponse userResponse = UserResponse.builder()
                .id(principal.getId())
                .name(principal.getName())
                .email(principal.getEmail())
                .role(principal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
                .address(user != null ? user.getAddress() : "")
                .phone(user != null ? user.getPhone() : "")
                .location(user != null ? user.getLocation() : "")
                .storeDescription(user != null ? user.getStoreDescription() : "")
                .requestedModerator(user != null ? user.getRequestedModerator() : false)
                .build();

        // Log activity
        activityRepository.save(Activity.builder()
                .userId(userResponse.getId())
                .userName(userResponse.getName())
                .action("LOGIN")
                .details(userResponse.getName() + " logged in.")
                .build());

        return ResponseEntity.ok(new JwtAuthenticationResponse("Login successful.", jwt, userResponse));
    }
}
