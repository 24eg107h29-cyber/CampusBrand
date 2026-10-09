package com.campusbrand.asset;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CampusUserRepository users;
    private final PasswordEncoder encoder;

    public AuthController(CampusUserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public record RegisterRequest(@NotBlank @Size(max=100) String name,
                                  @NotBlank @Email @Size(max=150) String email,
                                  @NotBlank @Size(min=6, max=72) String password) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "This email is already registered."));
        }
        CampusUser user = new CampusUser();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(encoder.encode(request.password()));
        try {
            users.save(user);
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "This email is already registered."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Account created successfully. Please sign in."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        CampusUser user = users.findByEmailIgnoreCase(request.email().trim().toLowerCase()).orElse(null);
        if (user == null || !encoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password."));
        }
        return ResponseEntity.ok(Map.of("message", "Login successful.", "name", user.getName(), "email", user.getEmail()));
    }
}
