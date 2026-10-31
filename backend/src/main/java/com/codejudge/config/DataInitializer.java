package com.codejudge.config;

import com.codejudge.dto.problem.SampleCaseDto;
import com.codejudge.entity.*;
import com.codejudge.repository.ProblemRepository;
import com.codejudge.repository.TagRepository;
import com.codejudge.repository.TestCaseRepository;
import com.codejudge.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final TagRepository tagRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public DataInitializer(UserRepository userRepository,
                           ProblemRepository problemRepository,
                           TestCaseRepository testCaseRepository,
                           TagRepository tagRepository,
                           PasswordEncoder passwordEncoder,
                           ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.tagRepository = tagRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users
        User admin = userRepository.findByUsername("admin").orElseGet(() -> {
            User u = new User("admin", "admin@codejudge.com", passwordEncoder.encode("admin123"), Role.ADMIN);
            return userRepository.save(u);
        });

        userRepository.findByUsername("coder").orElseGet(() -> {
            User u = new User("coder", "coder@codejudge.com", passwordEncoder.encode("password123"), Role.USER);
            return userRepository.save(u);
        });

        // 2. Seed Default Problem "Two Sum" if not present
        if (!problemRepository.existsBySlug("two-sum")) {
            Tag arrayTag = tagRepository.findBySlug("array")
                    .orElseGet(() -> tagRepository.save(new Tag("Array", "array")));
            Tag hashTag = tagRepository.findBySlug("hash-table")
                    .orElseGet(() -> tagRepository.save(new Tag("Hash Table", "hash-table")));

            Problem twoSum = new Problem();
            twoSum.setSlug("two-sum");
            twoSum.setTitle("Two Sum");
            twoSum.setDescriptionMd(
                    "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n" +
                    "You may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\n" +
                    "### Constraints\n" +
                    "- `2 <= nums.length <= 10^4`\n" +
                    "- `-10^9 <= nums[i] <= 10^9`\n" +
                    "- `-10^9 <= target <= 10^9`"
            );
            twoSum.setDifficulty(Difficulty.EASY);
            twoSum.setTimeLimitMs(1000);
            twoSum.setMemoryLimitMb(256);
            twoSum.setIsPublished(true);
            twoSum.setAuthor(admin);
            twoSum.setTags(Set.of(arrayTag, hashTag));

            List<SampleCaseDto> samples = List.of(
                    new SampleCaseDto("4\n2 7 11 15\n9", "0 1", "nums[0] + nums[1] == 9, so output is 0 1"),
                    new SampleCaseDto("3\n3 2 4\n6", "1 2", "nums[1] + nums[2] == 6, so output is 1 2")
            );
            twoSum.setSampleCases(objectMapper.writeValueAsString(samples));

            Problem savedProblem = problemRepository.save(twoSum);

            // Test cases: input format: N \n [nums separated by space] \n target
            testCaseRepository.save(new TestCase(savedProblem, "4\n2 7 11 15\n9", "0 1", false, 1));
            testCaseRepository.save(new TestCase(savedProblem, "3\n3 2 4\n6", "1 2", false, 2));
            testCaseRepository.save(new TestCase(savedProblem, "2\n3 3\n6", "0 1", true, 3));
            testCaseRepository.save(new TestCase(savedProblem, "5\n1 5 3 7 9\n12", "1 3", true, 4));
        }
    }
}

