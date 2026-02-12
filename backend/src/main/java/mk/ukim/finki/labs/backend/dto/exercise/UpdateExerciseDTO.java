package mk.ukim.finki.labs.backend.dto.exercise;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import mk.ukim.finki.labs.backend.model.domain.ExerciseStatus;
import mk.ukim.finki.labs.backend.validation.ValidHtml;

import java.time.LocalDate;

public record UpdateExerciseDTO(
        Long id,
        
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,
        
        @Size(max = 10_000, message = "Description payload must not exceed 10,000 characters")
        @ValidHtml(maxTextLength = 5000, message = "Description content is invalid or exceeds maximum length")
        String description,
        
        LocalDate labDate,
        
        LocalDate dueDate,
        
        @Min(value = 1, message = "Total points must be at least 1")
        Integer totalPoints,

        @Min(value = 0, message = "Minimum points for signature must be at least 0")
        Integer minPointsForSignature,

        ExerciseStatus status
) {
}
