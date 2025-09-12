package mk.ukim.finki.labs.backend.dto.lab_course;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AddStudentsToCourseDTO(
        @NotEmpty(message = "At least one student is required")
        List<String> studentIds
) {}
