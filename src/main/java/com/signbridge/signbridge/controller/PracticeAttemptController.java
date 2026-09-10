package com.signbridge.signbridge.controller;

import com.signbridge.signbridge.model.PracticeAttempt;
import com.signbridge.signbridge.repository.PracticeAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practice")
@CrossOrigin(origins = "*")
public class PracticeAttemptController {

    @Autowired
    private PracticeAttemptRepository practiceAttemptRepository;

    @GetMapping
    public List<PracticeAttempt> getAllAttempts() {
        return practiceAttemptRepository.findAll();
    }

    @PostMapping
    public PracticeAttempt addAttempt(@RequestBody PracticeAttempt attempt) {
        return practiceAttemptRepository.save(attempt);
    }
}