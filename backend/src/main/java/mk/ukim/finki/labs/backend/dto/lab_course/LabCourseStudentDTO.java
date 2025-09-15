package mk.ukim.finki.labs.backend.dto.lab_course;

import mk.ukim.finki.labs.backend.model.domain.*;

import java.util.Optional;

public record LabCourseStudentDTO(
        String index,
        String email,
        String name,
        String lastName,
        LabCourseStudentStudyProgramDto studyProgram,
        SignatureStatus signatureStatus,
        Integer labsCompleted
) {
    public static LabCourseStudentDTO from(LabCourseStudent lcs) {
        Student student = lcs.getStudent();

        long successfulExercisesCount = lcs.getStudentExerciseScores().stream()
                .filter(score -> {
                    Integer corePoints = score.getCorePoints();
                    Integer minPoints = Optional.ofNullable(score.getExercise())
                            .map(Exercise::getMinPointsForSignature)
                            .orElse(0);
                    return corePoints != null && corePoints >= minPoints;
                })
                .count();

        return new LabCourseStudentDTO(
                student.getIndex(),
                student.getEmail(),
                student.getName(),
                student.getLastName(),
                new LabCourseStudentStudyProgramDto(
                        student.getStudyProgram().getCode(),
                        student.getStudyProgram().getName()
                ),
                lcs.getSignatureStatus(),
                (int) successfulExercisesCount
        );
    }
        record LabCourseStudentStudyProgramDto(String code, String name) {}
}
