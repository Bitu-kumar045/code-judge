package com.codejudge.dto.problem;

import com.codejudge.entity.Difficulty;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class ProblemResponse {
    private UUID id;
    private String slug;
    private String title;
    private String descriptionMd;
    private Difficulty difficulty;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private List<SampleCaseDto> sampleCases;
    private Set<String> tags;
    private Boolean isPublished;
    private String authorUsername;
    private Instant createdAt;

    public ProblemResponse() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescriptionMd() { return descriptionMd; }
    public void setDescriptionMd(String descriptionMd) { this.descriptionMd = descriptionMd; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public Integer getTimeLimitMs() { return timeLimitMs; }
    public void setTimeLimitMs(Integer timeLimitMs) { this.timeLimitMs = timeLimitMs; }

    public Integer getMemoryLimitMb() { return memoryLimitMb; }
    public void setMemoryLimitMb(Integer memoryLimitMb) { this.memoryLimitMb = memoryLimitMb; }

    public List<SampleCaseDto> getSampleCases() { return sampleCases; }
    public void setSampleCases(List<SampleCaseDto> sampleCases) { this.sampleCases = sampleCases; }

    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

