package com.codejudge.controller;

import com.codejudge.dto.common.ApiResponse;
import com.codejudge.dto.problem.*;
import com.codejudge.entity.Difficulty;
import com.codejudge.security.UserPrincipal;
import com.codejudge.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProblemSummaryResponse>>> listProblems(
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));

        Page<ProblemSummaryResponse> problems = problemService.listProblems(difficulty, search, false, pageable);
        return ResponseEntity.ok(ApiResponse.success(problems));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ProblemResponse>> getProblemBySlug(@PathVariable String slug) {
        ProblemResponse problem = problemService.getProblemBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(problem));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ApiResponse<ProblemResponse>> getProblemById(@PathVariable UUID id) {
        ProblemResponse problem = problemService.getProblemById(id);
        return ResponseEntity.ok(ApiResponse.success(problem));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProblemResponse>> createProblem(
            @Valid @RequestBody ProblemCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ProblemResponse created = problemService.createProblem(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Problem created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProblemResponse>> updateProblem(
            @PathVariable UUID id,
            @RequestBody ProblemUpdateRequest request) {
        ProblemResponse updated = problemService.updateProblem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Problem updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProblem(@PathVariable UUID id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(ApiResponse.success("Problem deleted successfully", null));
    }
}

