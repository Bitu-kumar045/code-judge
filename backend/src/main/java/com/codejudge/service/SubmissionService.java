package com.codejudge.service;

import com.codejudge.dto.submission.JudgeTaskDto;
import com.codejudge.dto.submission.SubmissionResponse;
import com.codejudge.dto.submission.SubmitRequest;
import com.codejudge.entity.*;
import com.codejudge.exception.ResourceNotFoundException;
import com.codejudge.repository.ProblemRepository;
import com.codejudge.repository.SubmissionRepository;
import com.codejudge.repository.TestCaseRepository;
import com.codejudge.repository.UserRepository;
import com.codejudge.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    public static final String JUDGE_QUEUE_KEY = "judge:queue";

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public SubmissionService(SubmissionRepository submissionRepository,
                             ProblemRepository problemRepository,
                             TestCaseRepository testCaseRepository,
                             UserRepository userRepository,
                             RedisTemplate<String, Object> redisTemplate) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public SubmissionResponse createSubmission(SubmitRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUser.getId()));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + request.getProblemId()));

        Submission submission = new Submission(user, problem, request.getLanguage(), request.getSourceCode());
        if (request.getContestId() != null) {
            submission.setContestId(request.getContestId());
        }

        Submission saved = submissionRepository.save(submission);

        // Fetch test cases for judging
        List<TestCase> testCases = testCaseRepository.findByProblemIdOrderByTestOrderAsc(problem.getId());

        List<JudgeTaskDto.TestCaseItem> tcItems = testCases.stream()
                .map(tc -> new JudgeTaskDto.TestCaseItem(tc.getId(), tc.getInputData(), tc.getExpectedOutput()))
                .collect(Collectors.toList());

        JudgeTaskDto task = new JudgeTaskDto(
                saved.getId(),
                saved.getLanguage(),
                saved.getSourceCode(),
                problem.getTimeLimitMs(),
                problem.getMemoryLimitMb(),
                tcItems
        );

        // Push task to Redis Queue for Judge Worker
        try {
            redisTemplate.opsForList().leftPush(JUDGE_QUEUE_KEY, task);
        } catch (Exception ex) {
            // Log queue push error, submission remains PENDING in DB
            System.err.println("Warning: failed to push submission to Redis queue: " + ex.getMessage());
        }

        return toSubmissionResponse(saved);
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getSubmissionById(UUID id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        return toSubmissionResponse(submission);
    }

    @Transactional(readOnly = true)
    public Page<SubmissionResponse> getUserSubmissions(UUID userId, Pageable pageable) {
        return submissionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toSubmissionResponse);
    }

    @Transactional(readOnly = true)
    public Page<SubmissionResponse> getProblemSubmissions(UUID problemId, Pageable pageable) {
        return submissionRepository.findByProblemIdOrderByCreatedAtDesc(problemId, pageable)
                .map(this::toSubmissionResponse);
    }

    private SubmissionResponse toSubmissionResponse(Submission s) {
        SubmissionResponse res = new SubmissionResponse();
        res.setId(s.getId());
        res.setUserId(s.getUser().getId());
        res.setUsername(s.getUser().getUsername());
        res.setProblemId(s.getProblem().getId());
        res.setProblemTitle(s.getProblem().getTitle());
        res.setProblemSlug(s.getProblem().getSlug());
        res.setLanguage(s.getLanguage());
        res.setSourceCode(s.getSourceCode());
        res.setStatus(s.getStatus());
        res.setVerdict(s.getVerdict());
        res.setRuntimeMs(s.getRuntimeMs());
        res.setMemoryKb(s.getMemoryKb());
        res.setErrorMessage(s.getErrorMessage());
        res.setCreatedAt(s.getCreatedAt());
        return res;
    }
}

