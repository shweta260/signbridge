package com.signbridge.signbridge.controller;

import com.signbridge.signbridge.model.User;
import com.signbridge.signbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@#$%^&+=!_\\-.,]).{8,}$"
    );

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User newUser) {
        Map<String, Object> response = new HashMap<>();

        String name = newUser.getFullName() == null ? "" : newUser.getFullName().trim();
        String email = newUser.getEmail() == null ? "" : newUser.getEmail().trim();
        String rawPassword = newUser.getPasswordHash() == null ? "" : newUser.getPasswordHash();

        if (name.split("\\s+").length < 2) {
            response.put("success", false);
            response.put("error", "Name must contain at least two words.");
            return response;
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            response.put("success", false);
            response.put("error", "Please enter a valid email address (must contain @ and a domain).");
            return response;
        }

        if (userRepository.findAll().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(email))) {
            response.put("success", false);
            response.put("error", "An account with this email already exists.");
            return response;
        }

        if (!PASSWORD_PATTERN.matcher(rawPassword).matches()) {
            response.put("success", false);
            response.put("error", "Password must be at least 8 characters and include a letter, a number, and a special character.");
            return response;
        }

        User user = new User();
        user.setFullName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(newUser.getRole() != null ? newUser.getRole() : "signer");

        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Account created successfully.");
        response.put("userId", user.getId());
        response.put("fullName", user.getFullName());
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        String email = credentials.getOrDefault("email", "").trim();
        String rawPassword = credentials.getOrDefault("password", "");

        User match = userRepository.findAll().stream()
            .filter(u -> u.getEmail().equalsIgnoreCase(email))
            .findFirst()
            .orElse(null);

        if (match == null || !passwordEncoder.matches(rawPassword, match.getPasswordHash())) {
            response.put("success", false);
            response.put("error", "Incorrect email or password.");
            return response;
        }

        response.put("success", true);
        response.put("userId", match.getId());
        response.put("fullName", match.getFullName());
        response.put("role", match.getRole());
        return response;
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        String email = body.getOrDefault("email", "").trim();
        String newPassword = body.getOrDefault("newPassword", "");

        User match = userRepository.findAll().stream()
            .filter(u -> u.getEmail().equalsIgnoreCase(email))
            .findFirst()
            .orElse(null);

        if (match == null) {
            response.put("success", false);
            response.put("error", "No account found with this email.");
            return response;
        }

        if (!PASSWORD_PATTERN.matcher(newPassword).matches()) {
            response.put("success", false);
            response.put("error", "Password must be at least 8 characters and include a letter, a number, and a special character.");
            return response;
        }

        match.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(match);

        response.put("success", true);
        response.put("message", "Password updated. You can now log in.");
        return response;
    }
}