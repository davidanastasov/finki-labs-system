package mk.ukim.finki.labs.backend.dto.lab_course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import mk.ukim.finki.labs.backend.model.domain.LabCourseStatus;
import mk.ukim.finki.labs.backend.model.domain.Semester;
import mk.ukim.finki.labs.backend.model.domain.JoinedSubject;
import mk.ukim.finki.labs.backend.model.domain.Professor;

import java.util.List;

public record UpdateLabCourseDTO(
        @NotBlank(message = "Semester code is required")
        String semesterCode,

        @NotBlank(message = "Subject abbreviation is required")
        String subjectAbbreviation,

        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotEmpty(message = "At least one professor is required")
        List<String> professorIds,

        @NotNull(message = "Assistant IDs list must be provided")
        List<String> assistantIds,

        LabCourseStatus status
) {

    public LabCourse toLabCourse(Semester semester, JoinedSubject joinedSubject,
                                 List<Professor> professors, List<Professor> assistants) {
        return new LabCourse(
                semester,
                joinedSubject,
                professors,
                assistants,
                description,
                status
        );
    }
}
