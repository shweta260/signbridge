package com.signbridge.signbridge.controller;

import com.signbridge.signbridge.model.TranslationHistory;
import com.signbridge.signbridge.repository.TranslationHistoryRepository;
import com.signbridge.signbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class TranslationHistoryController {

    @Autowired
    private TranslationHistoryRepository translationHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<TranslationHistory> getHistory(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return translationHistoryRepository.findByUser_Id(userId);
        }
        return translationHistoryRepository.findAll();
    }

    @PostMapping
    public TranslationHistory addHistoryEntry(@RequestBody Map<String, Object> payload) {
        TranslationHistory entry = new TranslationHistory();

        Object userIdObj = payload.get("userId");
        if (userIdObj != null) {
            Long userId = Long.valueOf(userIdObj.toString());
            userRepository.findById(userId).ifPresent(entry::setUser);
        }

        entry.setSourceType((String) payload.get("sourceType"));
        entry.setOriginalInput((String) payload.get("originalInput"));
        entry.setTranslatedOutput((String) payload.get("translatedOutput"));

        return translationHistoryRepository.save(entry);
    }
}