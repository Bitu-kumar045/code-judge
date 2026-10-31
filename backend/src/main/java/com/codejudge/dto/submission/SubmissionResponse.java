package com.codejudge.dto.submission;

import com.codejudge.entity.Language;
import com.codejudge.entity.SubmissionStatus;
import com.codejudge.entity.Verdict;
import java.time.Instant;
import java.util.UUID;

public class SubmissionResponse {
    private UUID id;
    private UUID userId;
    private String username;
    private UUID problemId;
    private String problemTitle;
    private String problemSlug;
    private Language language;
    private String sourceCode;
    private SubmissionStatus status;
    private Verdict verdict;
    private Integer runtimeMs;
    private Integer memoryKb;
    private String errorMessage;
    private Instant createdAt;

    public SubmissionResponse() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public UUID getProblemId() { return problemId; }
    public void setProblemId(UUID problemId) { this.problemId = problemId; }

    public String getProblemTitle() { return problemTitle; }
    public void setProblemTitle(String problemTitle) { this.problemTitle = problemTitle; }

    public String getProblemSlug() { return problemSlug; }
    public void setProblemSlug(String problemSlug) { this.problemSlug = problemSlug; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }

    public Verdict getVerdict() { return verdict; }
    public void setVerdict(Verdict verdict) { this.verdict = verdict; }

    public Integer getRuntimeMs() { return runtimeMs; }
    public void setRuntimeMs(Integer runtimeMs) { this.runtimeMs = runtimeMs; }

    public Integer getMemoryKb() { return memoryKb; }
    public void setMemoryKb(Integer memoryKb) { this.memoryKb = memoryKb; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

