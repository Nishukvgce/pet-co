package com.eduprajna.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eduprajna.entity.User;
import com.eduprajna.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    public Optional<User> findByEmail(String email) { return userRepository.findByEmail(email); }
    public Optional<User> findById(Long id) { return userRepository.findById(id); }
    @Transactional
    public User save(User user) { 
        System.out.println("DEBUG: UserService - Saving user with pincode: " + user.getPincode());
        User savedUser = userRepository.save(user); 
        System.out.println("DEBUG: UserService - User saved with ID: " + savedUser.getId() + " and pincode: " + savedUser.getPincode());
        return savedUser;
    }
    public long count() { return userRepository.count(); }
}