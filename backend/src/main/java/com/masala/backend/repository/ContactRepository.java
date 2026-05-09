// com.masala.backend.repository.ContactRepository.java
package com.masala.backend.repository;

import com.masala.backend.model.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<ContactSubmission, Long> {
}