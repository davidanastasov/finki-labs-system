package mk.ukim.finki.labs.backend.dto.exercise;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import mk.ukim.finki.labs.backend.model.domain.Exercise;
import mk.ukim.finki.labs.backend.model.domain.ExerciseStatus;
import mk.ukim.finki.labs.backend.model.domain.LabCourse;

import java.time.LocalDate;

public record CreateExerciseDTO(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,
        
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,
        
        LocalDate labDate,
        
        LocalDate dueDate,
        
        @NotNull(message = "Total points is required")
        @Min(value = 1, message = "Total points must be at least 1")
        Integer totalPoints,

        @NotNull(message = "Lab course ID is required")
        Long labCourseId,
        
        ExerciseStatus status
) {
    
    public Exercise toExercise(LabCourse labCourse) {
        return new Exercise(
            title,
            description,
            labDate,
            dueDate,
            totalPoints,
            labCourse,
            status != null ? status : ExerciseStatus.DRAFT
        );
    }
}
