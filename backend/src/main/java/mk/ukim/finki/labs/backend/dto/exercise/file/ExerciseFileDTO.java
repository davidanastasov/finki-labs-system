package mk.ukim.finki.labs.backend.dto.exercise.file;

public record ExerciseFileDTO(
        String id,
        String fileName,
        long size,
        String contentType
) {
}
