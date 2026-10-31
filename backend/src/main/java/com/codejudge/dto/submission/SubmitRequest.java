package com.codejudge.dto.submission;

import com.codejudge.entity.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class SubmitRequest {

    @NotNull(message = "Problem ID is required")
    private UUID problemId;

    private UUID contestId;

    @NotNull(message = "Language is required")
    private Language language;

    @NotBlank(message = "Source code cannot be empty")
    private String sourceCode;

    public SubmitRequest() {}

    public SubmitRequest(UUID problemId, UUID contestId, Language language, String sourceCode) {
        this.problemId = problemId;
        this.contestId = contestId;
        this.language = language;
        this.sourceCode = sourceCode;
    }

    public UUID getProblemId() { return problemId; }
    public void setProblemId(UUID problemId) { this.problemId = problemId; }

    public UUID getContestId() { return contestId; }
    public void setContestId(UUID contestId) { this.contestId = contestId; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
}

