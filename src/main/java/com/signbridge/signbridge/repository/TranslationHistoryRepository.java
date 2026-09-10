package com.signbridge.signbridge.repository;

import com.signbridge.signbridge.model.TranslationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TranslationHistoryRepository extends JpaRepository<TranslationHistory, Long> {
    List<TranslationHistory> findByUser_Id(Long userId);
}