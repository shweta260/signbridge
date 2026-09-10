package com.signbridge.signbridge.repository;

import com.signbridge.signbridge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}