// com.masala.backend.controller.ContactController.java
package com.masala.backend.controller;

import com.masala.backend.model.ContactSubmission;
import com.masala.backend.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    // Save a new contact form submission
    @PostMapping
    public ResponseEntity<ContactSubmission> submitContact(@RequestBody ContactSubmission submission) {
        ContactSubmission saved = contactRepository.save(submission);
        return ResponseEntity.ok(saved);
    }

    // (Optional) View all submissions from AdminDashboard
    @GetMapping
    public List<ContactSubmission> getAllSubmissions() {
        return contactRepository.findAll();
    }
}