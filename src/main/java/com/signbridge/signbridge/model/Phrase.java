package com.signbridge.signbridge.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "phrases")
public class Phrase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phrase_text", nullable = false)
    private String phraseText;

    @Column(nullable = false)
    private String category;

    @Column(name = "gesture_image_path")
    private String gestureImagePath;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPhraseText() { return phraseText; }
    public void setPhraseText(String phraseText) { this.phraseText = phraseText; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getGestureImagePath() { return gestureImagePath; }
    public void setGestureImagePath(String gestureImagePath) { this.gestureImagePath = gestureImagePath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
