package mk.ukim.finki.labs.backend.dto.exercise.file;

import mk.ukim.finki.labs.backend.model.domain.ExerciseFile;

public record FileDownloadResult(
        ExerciseFile exerciseFile,
        byte[] fileData
) {
}
