package mk.ukim.finki.labs.backend.dto.exercise;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import mk.ukim.finki.labs.backend.model.domain.ExerciseStatus;

import java.time.LocalDate;

public record UpdateExerciseDTO(
        Long id,
        
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,
        
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,
        
        LocalDate labDate,
        
        LocalDate dueDate,
        
        @Min(value = 1, message = "Total points must be at least 1")
        Integer totalPoints,
        
        String filePath,
        
        ExerciseStatus status
) {
}
