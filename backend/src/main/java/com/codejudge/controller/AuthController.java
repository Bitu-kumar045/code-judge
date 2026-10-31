package com.codejudge.controller;

import com.codejudge.dto.auth.AuthResponse;
import com.codejudge.dto.auth.LoginRequest;
import com.codejudge.dto.auth.RegisterRequest;
import com.codejudge.dto.auth.UserProfileResponse;
import com.codejudge.dto.common.ApiResponse;
import com.codejudge.security.UserPrincipal;
import com.codejudge.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileResponse profile = authService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}

