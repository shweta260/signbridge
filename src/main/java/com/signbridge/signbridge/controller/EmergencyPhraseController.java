package com.signbridge.signbridge.controller;

import com.signbridge.signbridge.model.EmergencyPhrase;
import com.signbridge.signbridge.repository.EmergencyPhraseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyPhraseController {

    @Autowired
    private EmergencyPhraseRepository emergencyPhraseRepository;

    @GetMapping
    public List<EmergencyPhrase> getAllEmergencyPhrases() {
        return emergencyPhraseRepository.findAll();
    }

    @PostMapping
    public EmergencyPhrase addEmergencyPhrase(@RequestBody EmergencyPhrase phrase) {
        return emergencyPhraseRepository.save(phrase);
    }
}
