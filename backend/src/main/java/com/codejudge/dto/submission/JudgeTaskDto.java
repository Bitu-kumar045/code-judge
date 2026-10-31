package com.codejudge.dto.submission;

import com.codejudge.entity.Language;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

public class JudgeTaskDto implements Serializable {
    private UUID submissionId;
    private Language language;
    private String sourceCode;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private List<TestCaseItem> testCases;

    public static class TestCaseItem implements Serializable {
        private UUID testCaseId;
        private String input;
        private String expectedOutput;

        public TestCaseItem() {}

        public TestCaseItem(UUID testCaseId, String input, String expectedOutput) {
            this.testCaseId = testCaseId;
            this.input = input;
            this.expectedOutput = expectedOutput;
        }

        public UUID getTestCaseId() { return testCaseId; }
        public void setTestCaseId(UUID testCaseId) { this.testCaseId = testCaseId; }

        public String getInput() { return input; }
        public void setInput(String input) { this.input = input; }

        public String getExpectedOutput() { return expectedOutput; }
        public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
    }

    public JudgeTaskDto() {}

    public JudgeTaskDto(UUID submissionId, Language language, String sourceCode, Integer timeLimitMs, Integer memoryLimitMb, List<TestCaseItem> testCases) {
        this.submissionId = submissionId;
        this.language = language;
        this.sourceCode = sourceCode;
        this.timeLimitMs = timeLimitMs;
        this.memoryLimitMb = memoryLimitMb;
        this.testCases = testCases;
    }

    public UUID getSubmissionId() { return submissionId; }
    public void setSubmissionId(UUID submissionId) { this.submissionId = submissionId; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public Integer getTimeLimitMs() { return timeLimitMs; }
    public void setTimeLimitMs(Integer timeLimitMs) { this.timeLimitMs = timeLimitMs; }

    public Integer getMemoryLimitMb() { return memoryLimitMb; }
    public void setMemoryLimitMb(Integer memoryLimitMb) { this.memoryLimitMb = memoryLimitMb; }

    public List<TestCaseItem> getTestCases() { return testCases; }
    public void setTestCases(List<TestCaseItem> testCases) { this.testCases = testCases; }
}

