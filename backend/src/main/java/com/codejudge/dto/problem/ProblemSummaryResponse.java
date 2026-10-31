package com.codejudge.dto.problem;

import com.codejudge.entity.Difficulty;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class ProblemSummaryResponse {
    private UUID id;
    private String slug;
    private String title;
    private Difficulty difficulty;
    private Set<String> tags;
    private Boolean isPublished;
    private Instant createdAt;

    public ProblemSummaryResponse() {}

    public ProblemSummaryResponse(UUID id, String slug, String title, Difficulty difficulty, Set<String> tags, Boolean isPublished, Instant createdAt) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.difficulty = difficulty;
        this.tags = tags;
        this.isPublished = isPublished;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

