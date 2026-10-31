package com.codejudge.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(name = "input_data", nullable = false, columnDefinition = "TEXT")
    private String inputData;

    @Column(name = "expected_output", nullable = false, columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = true;

    @Column(name = "test_order", nullable = false)
    private Integer testOrder = 1;

    public TestCase() {}

    public TestCase(Problem problem, String inputData, String expectedOutput, Boolean isHidden, Integer testOrder) {
        this.problem = problem;
        this.inputData = inputData;
        this.expectedOutput = expectedOutput;
        this.isHidden = isHidden != null ? isHidden : true;
        this.testOrder = testOrder != null ? testOrder : 1;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getInputData() { return inputData; }
    public void setInputData(String inputData) { this.inputData = inputData; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public Boolean getIsHidden() { return isHidden; }
    public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }

    public Integer getTestOrder() { return testOrder; }
    public void setTestOrder(Integer testOrder) { this.testOrder = testOrder; }
}

