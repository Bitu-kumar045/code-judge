package com.codejudge.dto.problem;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class TestCaseDto {
    private UUID id;

    @NotBlank(message = "Input data is required")
    private String inputData;

    @NotBlank(message = "Expected output is required")
    private String expectedOutput;

    private Boolean isHidden = true;
    private Integer testOrder = 1;

    public TestCaseDto() {}

    public TestCaseDto(UUID id, String inputData, String expectedOutput, Boolean isHidden, Integer testOrder) {
        this.id = id;
        this.inputData = inputData;
        this.expectedOutput = expectedOutput;
        this.isHidden = isHidden != null ? isHidden : true;
        this.testOrder = testOrder != null ? testOrder : 1;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getInputData() { return inputData; }
    public void setInputData(String inputData) { this.inputData = inputData; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public Boolean getIsHidden() { return isHidden; }
    public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }

    public Integer getTestOrder() { return testOrder; }
    public void setTestOrder(Integer testOrder) { this.testOrder = testOrder; }
}

