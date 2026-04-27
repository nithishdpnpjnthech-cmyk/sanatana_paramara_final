package com.eduprajna.controller;

import com.eduprajna.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000", "http://56.228.81.193",
        "http://56.228.81.193:8080" })
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-contact-thankyou")
    public ResponseEntity<?> sendContactThankYou(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        if (name == null || email == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and email are required."));
        }
        try {
            boolean sent = emailService.sendContactThankYou(name, email);
            if (sent) {
                return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", "Failed to send email. Check backend logs."));
            }
        } catch (Exception e) {
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error: " + e.getMessage(), "stackTrace", sw.toString()));
        }
    }

    @PostMapping("/send-subscription-confirmation")
    public ResponseEntity<?> sendSubscriptionConfirmation(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required."));
        }
        try {
            boolean sent = emailService.sendSubscriptionConfirmation(email);
            if (sent) {
                return ResponseEntity.ok(Map.of("message", "Subscription email sent successfully"));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", "Failed to send email. Check backend logs."));
            }
        } catch (Exception e) {
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error: " + e.getMessage(), "stackTrace", sw.toString()));
        }
    }

    @PostMapping("/send-confirmation")
    public ResponseEntity<?> sendOrderConfirmation(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("email") || !payload.containsKey("items")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email and items are required"));
        }

        try {
            boolean sent = emailService.sendOrderConfirmation(payload);
            if (sent) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Confirmation email sent"));
            } else {
                return ResponseEntity.internalServerError().body(
                        Map.of("success", false, "message", "Failed to send confirmation email. Check backend logs."));
            }
        } catch (Exception e) {
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            return ResponseEntity.internalServerError().body(
                    Map.of("success", false, "message", "Error: " + e.getMessage(), "stackTrace", sw.toString()));
        }
    }

    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestParam String to) {
        try {
            boolean sent = emailService.sendSubscriptionConfirmation(to);
            if (sent) {
                return ResponseEntity.ok(Map.of("message", "Test email sent successfully to " + to));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message", "Failed to send test email"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
