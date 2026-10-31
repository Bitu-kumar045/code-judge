package com.codejudge.dto.auth;

import com.codejudge.entity.Role;
import java.time.Instant;
import java.util.UUID;

public class UserProfileResponse {
    private UUID id;
    private String username;
    private String email;
    private Role role;
    private Integer rating;
    private Integer solvedCount;
    private Instant createdAt;

    public UserProfileResponse() {}

    public UserProfileResponse(UUID id, String username, String email, Role role, Integer rating, Integer solvedCount, Instant createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.rating = rating;
        this.solvedCount = solvedCount;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Integer getSolvedCount() { return solvedCount; }
    public void setSolvedCount(Integer solvedCount) { this.solvedCount = solvedCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

