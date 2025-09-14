package mk.ukim.finki.labs.backend.dto.scoring;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateStudentScoreDTO(
        @NotBlank(message = "Student index is required")
        String studentIndex,

        @NotNull(message = "Core points is required")
        @Min(value = 0, message = "Core points must be non-negative")
        Integer corePoints
) {
}
