package mk.ukim.finki.labs.backend.dto.scoring;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BulkUpdateScoresDTO(
        @NotEmpty(message = "At least one score update is required")
        @Valid
        List<UpdateStudentScoreDTO> scores
) {
}
