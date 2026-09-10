package com.signbridge.signbridge.controller;

import com.signbridge.signbridge.model.Phrase;
import com.signbridge.signbridge.repository.PhraseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phrases")
@CrossOrigin(origins = "*")
public class PhraseController {

    @Autowired
    private PhraseRepository phraseRepository;

    @GetMapping
    public List<Phrase> getAllPhrases() {
        return phraseRepository.findAll();
    }

    @PostMapping
    public Phrase addPhrase(@RequestBody Phrase phrase) {
        return phraseRepository.save(phrase);
    }
}
