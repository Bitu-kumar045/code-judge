package com.codejudge.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "description_md", nullable = false, columnDefinition = "TEXT")
    private String descriptionMd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty = Difficulty.EASY;

    @Column(name = "time_limit_ms", nullable = false)
    private Integer timeLimitMs = 1000;

    @Column(name = "memory_limit_mb", nullable = false)
    private Integer memoryLimitMb = 256;

    @Column(name = "sample_cases", nullable = false, columnDefinition = "TEXT")
    private String sampleCases = "[]";

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "problem_tags",
        joinColumns = @JoinColumn(name = "problem_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public Problem() {}

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

    public String getSampleCases() { return sampleCases; }
    public void setSampleCases(String sampleCases) { this.sampleCases = sampleCases; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public Set<Tag> getTags() { return tags; }
    public void setTags(Set<Tag> tags) { this.tags = tags; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

