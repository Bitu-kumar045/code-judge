package com.codejudge.dto.problem;

import com.codejudge.entity.Difficulty;
import java.util.List;
import java.util.Set;

public class ProblemUpdateRequest {
    private String title;
    private String descriptionMd;
    private Difficulty difficulty;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private List<SampleCaseDto> sampleCases;
    private Set<String> tagSlugs;
    private Boolean isPublished;

    public ProblemUpdateRequest() {}

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

    public Set<String> getTagSlugs() { return tagSlugs; }
    public void setTagSlugs(Set<String> tagSlugs) { this.tagSlugs = tagSlugs; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }
}

