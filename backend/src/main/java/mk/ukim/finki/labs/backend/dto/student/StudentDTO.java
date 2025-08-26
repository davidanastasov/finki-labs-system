package mk.ukim.finki.labs.backend.dto.student;

import mk.ukim.finki.labs.backend.dto.study_program.StudyProgramDTO;
import mk.ukim.finki.labs.backend.model.domain.Student;

public record StudentDTO(
         String index,
         String email,
         String name,
         String lastName,
         String parentName,
         StudyProgramDTO studyProgram
) {

    public static StudentDTO from(Student student) {
        return new StudentDTO(
                student.getIndex(),
                student.getEmail(),
                student.getName(),
                student.getLastName(),
                student.getParentName(),
                StudyProgramDTO.from(student.getStudyProgram())
        );
    }
}
