package com.signbridge.signbridge.repository;

import com.signbridge.signbridge.model.Phrase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhraseRepository extends JpaRepository<Phrase, Long> {
}