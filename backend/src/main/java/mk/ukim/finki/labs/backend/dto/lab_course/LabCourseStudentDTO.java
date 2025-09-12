package mk.ukim.finki.labs.backend.dto.lab_course;

import mk.ukim.finki.labs.backend.model.domain.Student;

public record LabCourseStudentDTO(
        String index,
        String email,
        String name,
        String lastName,
        LabCourseStudentStudyProgramDto studyProgram
) {
    public static LabCourseStudentDTO from(Student student){
        return new LabCourseStudentDTO(
                student.getIndex(),
                student.getEmail(),
                student.getName(),
                student.getLastName(),
                new LabCourseStudentStudyProgramDto(student.getStudyProgram().getCode(), student.getStudyProgram().getName())
        );
    }

    record LabCourseStudentStudyProgramDto(String code, String name) {}
}
