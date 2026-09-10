package com.signbridge.signbridge.repository;

import com.signbridge.signbridge.model.EmergencyPhrase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyPhraseRepository extends JpaRepository<EmergencyPhrase, Long> {
}