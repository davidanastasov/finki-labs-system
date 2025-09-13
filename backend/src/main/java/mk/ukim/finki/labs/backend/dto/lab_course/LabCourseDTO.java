package mk.ukim.finki.labs.backend.dto.lab_course;

import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import mk.ukim.finki.labs.backend.model.domain.LabCourseStatus;
import mk.ukim.finki.labs.backend.model.domain.SemesterType;

import java.util.List;
import java.util.Optional;

public record LabCourseDTO(
        Long id,
        LabCourseSemesterDTO semester,
        LabCourseSubjectDTO subject,
        String description,
        List<LabCourseProfessorDTO> professors,
        List<LabCourseProfessorDTO> assistants,
        LabCourseStatus status,
        Integer enrolledStudentsCount
) {

    public static LabCourseDTO from(LabCourse labCourse) {
        return new LabCourseDTO(
                labCourse.getId(),
                Optional.ofNullable(labCourse.getSemester())
                        .map(semester -> new LabCourseSemesterDTO(semester.getCode(), semester.getYear(), semester.getSemesterType()))
                        .orElse(null),
                Optional.ofNullable(labCourse.getJoinedSubject())
                        .map(subject -> new LabCourseSubjectDTO(subject.getAbbreviation(), subject.getName(), subject.getMainSubject().getId()))
                        .orElse(null),
                labCourse.getDescription(),
                labCourse.getProfessors()
                        .stream()
                        .map(professor -> new LabCourseProfessorDTO(professor.getId(), professor.getName()))
                        .toList(),
                labCourse.getAssistants()
                        .stream()
                        .map(professor -> new LabCourseProfessorDTO(professor.getId(), professor.getName()))
                        .toList(),
                labCourse.getStatus(),
                labCourse.getLabCourseStudents() != null ? labCourse.getLabCourseStudents().size() : 0
        );
    }

    record LabCourseProfessorDTO(String id, String name) {
    }

    record LabCourseSubjectDTO(String abbreviation, String name, String code) {
    }

    record LabCourseSemesterDTO(String code, String year, SemesterType type) {
    }

}
