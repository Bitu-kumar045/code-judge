package com.codejudge.service;

import com.codejudge.dto.problem.*;
import com.codejudge.entity.*;
import com.codejudge.exception.BadRequestException;
import com.codejudge.exception.ResourceNotFoundException;
import com.codejudge.repository.ProblemRepository;
import com.codejudge.repository.TagRepository;
import com.codejudge.repository.TestCaseRepository;
import com.codejudge.repository.UserRepository;
import com.codejudge.security.UserPrincipal;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public ProblemService(ProblemRepository problemRepository,
                          TestCaseRepository testCaseRepository,
                          TagRepository tagRepository,
                          UserRepository userRepository,
                          ObjectMapper objectMapper) {
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ProblemResponse createProblem(ProblemCreateRequest request, UserPrincipal currentUser) {
        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = generateSlug(request.getTitle());
        }

        if (problemRepository.existsBySlug(slug)) {
            throw new BadRequestException("Problem with slug '" + slug + "' already exists");
        }

        Problem problem = new Problem();
        problem.setSlug(slug);
        problem.setTitle(request.getTitle());
        problem.setDescriptionMd(request.getDescriptionMd());
        problem.setDifficulty(request.getDifficulty());
        problem.setTimeLimitMs(request.getTimeLimitMs());
        problem.setMemoryLimitMb(request.getMemoryLimitMb());
        problem.setIsPublished(request.getIsPublished() != null ? request.getIsPublished() : true);

        if (currentUser != null) {
            userRepository.findById(currentUser.getId()).ifPresent(problem::setAuthor);
        }

        // Handle sample cases
        try {
            problem.setSampleCases(objectMapper.writeValueAsString(request.getSampleCases()));
        } catch (JsonProcessingException e) {
            problem.setSampleCases("[]");
        }

        // Handle tags
        if (request.getTagSlugs() != null && !request.getTagSlugs().isEmpty()) {
            Set<Tag> tags = resolveTags(request.getTagSlugs());
            problem.setTags(tags);
        }

        Problem savedProblem = problemRepository.save(problem);

        // Handle test cases
        if (request.getTestCases() != null && !request.getTestCases().isEmpty()) {
            int order = 1;
            List<TestCase> testCasesToSave = new ArrayList<>();
            for (TestCaseDto tcDto : request.getTestCases()) {
                TestCase tc = new TestCase(
                        savedProblem,
                        tcDto.getInputData(),
                        tcDto.getExpectedOutput(),
                        tcDto.getIsHidden() != null ? tcDto.getIsHidden() : true,
                        tcDto.getTestOrder() != null ? tcDto.getTestOrder() : order++
                );
                testCasesToSave.add(tc);
            }
            testCaseRepository.saveAll(testCasesToSave);
        }

        return toProblemResponse(savedProblem);
    }

    @Transactional(readOnly = true)
    public ProblemResponse getProblemBySlug(String slug) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with slug: " + slug));
        return toProblemResponse(problem);
    }

    @Transactional(readOnly = true)
    public ProblemResponse getProblemById(UUID id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));
        return toProblemResponse(problem);
    }

    @Transactional(readOnly = true)
    public Page<ProblemSummaryResponse> listProblems(Difficulty difficulty, String search, boolean includeUnpublished, Pageable pageable) {
        Page<Problem> page = problemRepository.searchProblems(difficulty, search, includeUnpublished, pageable);
        return page.map(this::toSummaryResponse);
    }

    @Transactional
    public ProblemResponse updateProblem(UUID id, ProblemUpdateRequest request) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            problem.setTitle(request.getTitle());
        }
        if (request.getDescriptionMd() != null && !request.getDescriptionMd().isBlank()) {
            problem.setDescriptionMd(request.getDescriptionMd());
        }
        if (request.getDifficulty() != null) {
            problem.setDifficulty(request.getDifficulty());
        }
        if (request.getTimeLimitMs() != null) {
            problem.setTimeLimitMs(request.getTimeLimitMs());
        }
        if (request.getMemoryLimitMb() != null) {
            problem.setMemoryLimitMb(request.getMemoryLimitMb());
        }
        if (request.getIsPublished() != null) {
            problem.setIsPublished(request.getIsPublished());
        }
        if (request.getSampleCases() != null) {
            try {
                problem.setSampleCases(objectMapper.writeValueAsString(request.getSampleCases()));
            } catch (JsonProcessingException e) {
                // Keep existing
            }
        }
        if (request.getTagSlugs() != null) {
            problem.setTags(resolveTags(request.getTagSlugs()));
        }

        Problem updated = problemRepository.save(problem);
        return toProblemResponse(updated);
    }

    @Transactional
    public void deleteProblem(UUID id) {
        if (!problemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Problem not found with id: " + id);
        }
        problemRepository.deleteById(id);
    }

    private Set<Tag> resolveTags(Set<String> tagSlugs) {
        Set<Tag> tags = new HashSet<>();
        for (String slug : tagSlugs) {
            Tag tag = tagRepository.findBySlug(slug)
                    .orElseGet(() -> tagRepository.save(new Tag(formatTagName(slug), slug)));
            tags.add(tag);
        }
        return tags;
    }

    private String formatTagName(String slug) {
        return Arrays.stream(slug.split("-"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

    private String generateSlug(String title) {
        return title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    private ProblemResponse toProblemResponse(Problem p) {
        ProblemResponse res = new ProblemResponse();
        res.setId(p.getId());
        res.setSlug(p.getSlug());
        res.setTitle(p.getTitle());
        res.setDescriptionMd(p.getDescriptionMd());
        res.setDifficulty(p.getDifficulty());
        res.setTimeLimitMs(p.getTimeLimitMs());
        res.setMemoryLimitMb(p.getMemoryLimitMb());
        res.setIsPublished(p.getIsPublished());
        res.setCreatedAt(p.getCreatedAt());

        if (p.getAuthor() != null) {
            res.setAuthorUsername(p.getAuthor().getUsername());
        }

        Set<String> tagNames = p.getTags() != null ?
                p.getTags().stream().map(Tag::getName).collect(Collectors.toSet()) : Collections.emptySet();
        res.setTags(tagNames);

        try {
            List<SampleCaseDto> sampleCases = objectMapper.readValue(p.getSampleCases(), new TypeReference<List<SampleCaseDto>>() {});
            res.setSampleCases(sampleCases);
        } catch (Exception e) {
            res.setSampleCases(Collections.emptyList());
        }

        return res;
    }

    private ProblemSummaryResponse toSummaryResponse(Problem p) {
        Set<String> tagNames = p.getTags() != null ?
                p.getTags().stream().map(Tag::getName).collect(Collectors.toSet()) : Collections.emptySet();

        return new ProblemSummaryResponse(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getDifficulty(),
                tagNames,
                p.getIsPublished(),
                p.getCreatedAt()
        );
    }
}

