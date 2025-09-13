package mk.ukim.finki.labs.backend.dto.exercise;

import mk.ukim.finki.labs.backend.dto.exercise.file.ExerciseFileDTO;
import mk.ukim.finki.labs.backend.model.domain.Exercise;
import mk.ukim.finki.labs.backend.model.domain.ExerciseFile;
import mk.ukim.finki.labs.backend.model.domain.ExerciseStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record ExerciseDetailsDTO(
        Long id,
        String title,
        String description,
        LocalDate labDate,
        LocalDate dueDate,
        Integer totalPoints,
        Long labCourseId,
        ExerciseStatus status,
        List<ExerciseFileDTO> files
) {
    
    public static ExerciseDetailsDTO from(Exercise exercise) {
        List<ExerciseFileDTO> exerciseFiles = exercise.getFiles().stream()
            .map(ExerciseDetailsDTO::mapToFileResponse)
            .collect(Collectors.toList());
            
        return new ExerciseDetailsDTO(
            exercise.getId(),
            exercise.getTitle(),
            exercise.getDescription(),
            exercise.getLabDate(),
            exercise.getDueDate(),
            exercise.getTotalPoints(),
            exercise.getLabCourse().getId(),
            exercise.getStatus(),
            exerciseFiles
        );
    }
    
    private static ExerciseFileDTO mapToFileResponse(ExerciseFile file) {
        return new ExerciseFileDTO(
            file.getId().toString(),
            file.getFileName(),
            file.getFileSize(),
            file.getContentType()
        );
    }
}
