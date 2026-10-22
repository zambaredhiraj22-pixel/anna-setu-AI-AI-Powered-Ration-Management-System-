
package com.ration_management.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ration_management.dto.AuthResponse;
import com.ration_management.dto.LoginRequest;
import com.ration_management.dto.RegisterRequest;
import com.ration_management.entity.AppUser;
import com.ration_management.repository.AppUserRepository;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username already exists");
        }

        AppUser user = new AppUser();
        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        // Public registration always creates a normal USER.
        // Never accept ADMIN or OFFICER from the registration request.
        user.setRole("USER");

        userRepository.save(user);

        return "Registration successful";
    }

    public AuthResponse login(LoginRequest request) {

        AppUser user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid username or password"));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid username or password");
        }

        String role = user.getRole();

        if (role == null
                || !(
                    role.equals("ADMIN")
                    || role.equals("OFFICER")
                    || role.equals("USER")
                )) {

            throw new IllegalStateException(
                    "Invalid user role. Contact administrator.");
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                role);

        return new AuthResponse(
                user.getUsername(),
                token,
                "Bearer");
    }
}
