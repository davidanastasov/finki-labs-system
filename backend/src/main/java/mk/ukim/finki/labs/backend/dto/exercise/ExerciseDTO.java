package mk.ukim.finki.labs.backend.dto.exercise;

import mk.ukim.finki.labs.backend.model.domain.Exercise;
import mk.ukim.finki.labs.backend.model.domain.ExerciseStatus;

import java.time.LocalDate;

public record ExerciseDTO(
        Long id,
        String title,
        String description,
        LocalDate labDate,
        LocalDate dueDate,
        Integer totalPoints,
        Long labCourseId,
        ExerciseStatus status
) {

    public static ExerciseDTO from(Exercise exercise) {
        return new ExerciseDTO(
                exercise.getId(),
                exercise.getTitle(),
                exercise.getDescription(),
                exercise.getLabDate(),
                exercise.getDueDate(),
                exercise.getTotalPoints(),
                exercise.getLabCourse().getId(),
                exercise.getStatus()
        );
    }
}
