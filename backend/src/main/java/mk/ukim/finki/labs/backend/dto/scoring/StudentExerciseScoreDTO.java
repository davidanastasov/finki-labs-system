package mk.ukim.finki.labs.backend.dto.scoring;

import mk.ukim.finki.labs.backend.model.domain.StudentExerciseScore;

import java.time.LocalDateTime;

public record StudentExerciseScoreDTO(
        Long id,
        String studentIndex,
        String studentName,
        Long exerciseId,
        String exerciseTitle,
        Integer corePoints,
        LocalDateTime dateGraded
) {

    public static StudentExerciseScoreDTO from(StudentExerciseScore score) {
        return new StudentExerciseScoreDTO(
                score.getId(),
                score.getStudent().getIndex(),
                score.getStudent().getName() + " " + score.getStudent().getLastName(),
                score.getExercise().getId(),
                score.getExercise().getTitle(),
                score.getCorePoints(),
                score.getDateGraded()
        );
    }

}
