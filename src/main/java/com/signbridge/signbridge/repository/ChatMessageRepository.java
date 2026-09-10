package com.signbridge.signbridge.repository;

import com.signbridge.signbridge.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}
