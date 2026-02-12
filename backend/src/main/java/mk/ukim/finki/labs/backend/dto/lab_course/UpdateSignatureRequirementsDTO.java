package mk.ukim.finki.labs.backend.dto.lab_course;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateSignatureRequirementsDTO(
        @NotNull(message = "Required exercises is required")
        @Min(value = 0, message = "Required exercises must be at least 0")
        Integer requiredExercises
) {
}
