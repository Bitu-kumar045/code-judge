package com.codejudge.dto.problem;

import com.codejudge.entity.Difficulty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class ProblemCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Problem description is required")
    private String descriptionMd;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @NotNull
    @Min(value = 100, message = "Time limit must be at least 100ms")
    private Integer timeLimitMs = 1000;

    @NotNull
    @Min(value = 16, message = "Memory limit must be at least 16MB")
    private Integer memoryLimitMb = 256;

    private List<SampleCaseDto> sampleCases = new ArrayList<>();

    private List<TestCaseDto> testCases = new ArrayList<>();

    private Set<String> tagSlugs;

    private Boolean isPublished = true;

    public ProblemCreateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

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

    public List<TestCaseDto> getTestCases() { return testCases; }
    public void setTestCases(List<TestCaseDto> testCases) { this.testCases = testCases; }

    public Set<String> getTagSlugs() { return tagSlugs; }
    public void setTagSlugs(Set<String> tagSlugs) { this.tagSlugs = tagSlugs; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }
}

