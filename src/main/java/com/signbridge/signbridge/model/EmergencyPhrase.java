package com.signbridge.signbridge.model;

import jakarta.persistence.*;

@Entity
@Table(name = "emergency_phrases")
public class EmergencyPhrase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String label;

    @Column(name = "phrase_text", nullable = false)
    private String phraseText;

    @Column(name = "gesture_image_path")
    private String gestureImagePath;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getPhraseText() { return phraseText; }
    public void setPhraseText(String phraseText) { this.phraseText = phraseText; }
    public String getGestureImagePath() { return gestureImagePath; }
    public void setGestureImagePath(String gestureImagePath) { this.gestureImagePath = gestureImagePath; }
}