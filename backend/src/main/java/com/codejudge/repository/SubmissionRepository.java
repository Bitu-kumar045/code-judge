package com.codejudge.repository;

import com.codejudge.entity.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    Page<Submission> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    Page<Submission> findByProblemIdOrderByCreatedAtDesc(UUID problemId, Pageable pageable);
    Page<Submission> findByUserIdAndProblemIdOrderByCreatedAtDesc(UUID userId, UUID problemId, Pageable pageable);
}

