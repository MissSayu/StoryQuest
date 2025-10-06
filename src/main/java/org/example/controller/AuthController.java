package org.example.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.example.model.User;
import org.example.repository.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            User u = existingUser.get();
            if (u.getPassword().equals(user.getPassword())) {

                return ResponseEntity.ok("Login succesvol!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wachtwoord incorrect");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Gebruiker niet gevonden");
        }
    }
}
