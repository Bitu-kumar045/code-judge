package com.codejudge.repository;

import com.codejudge.entity.Difficulty;
import com.codejudge.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    Optional<Problem> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query("SELECT p FROM Problem p WHERE " +
           "(:difficulty IS NULL OR p.difficulty = :difficulty) AND " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.slug) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:includeUnpublished = true OR p.isPublished = true)")
    Page<Problem> searchProblems(
        @Param("difficulty") Difficulty difficulty,
        @Param("search") String search,
        @Param("includeUnpublished") boolean includeUnpublished,
        Pageable pageable
    );
}

