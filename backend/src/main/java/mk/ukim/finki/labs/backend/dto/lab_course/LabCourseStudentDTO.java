package mk.ukim.finki.labs.backend.dto.lab_course;

import mk.ukim.finki.labs.backend.model.domain.LabCourseStudent;
import mk.ukim.finki.labs.backend.model.domain.SignatureStatus;
import mk.ukim.finki.labs.backend.model.domain.Student;

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

        long completed = lcs.getStudentExerciseScores().stream()
                .filter(score -> score.getCorePoints() != null &&
                        score.getExercise().getMinPointsForSignature() != null &&
                        score.getCorePoints() >= score.getExercise().getMinPointsForSignature())
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
                (int) completed
        );
    }
        record LabCourseStudentStudyProgramDto(String code, String name) {}
}
