package org.example.service;

import org.example.model.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {


    private final String DEMO_USER = "sayu";
    private final String DEMO_PASS = "virelight";

    public boolean login(User user) {
        return DEMO_USER.equals(user.getUsername()) && DEMO_PASS.equals(user.getPassword());
    }
}
