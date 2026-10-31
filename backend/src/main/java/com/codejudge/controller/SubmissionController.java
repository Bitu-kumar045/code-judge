package com.codejudge.controller;

import com.codejudge.dto.common.ApiResponse;
import com.codejudge.dto.submission.SubmissionResponse;
import com.codejudge.dto.submission.SubmitRequest;
import com.codejudge.security.UserPrincipal;
import com.codejudge.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitCode(
            @Valid @RequestBody SubmitRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        SubmissionResponse submission = submissionService.createSubmission(request, currentUser);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.success("Code submitted for judging", submission));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmission(@PathVariable UUID id) {
        SubmissionResponse submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success(submission));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<SubmissionResponse>>> getUserSubmissions(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SubmissionResponse> submissions = submissionService.getUserSubmissions(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse<Page<SubmissionResponse>>> getProblemSubmissions(
            @PathVariable UUID problemId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SubmissionResponse> submissions = submissionService.getProblemSubmissions(problemId, pageable);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }
}

