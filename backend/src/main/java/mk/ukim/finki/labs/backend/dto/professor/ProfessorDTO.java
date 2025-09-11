package mk.ukim.finki.labs.backend.dto.professor;

import mk.ukim.finki.labs.backend.model.domain.Professor;
import mk.ukim.finki.labs.backend.model.domain.ProfessorTitle;

public record ProfessorDTO(
        String id,
        String name,
        String email,
        ProfessorTitle title
) {

    public static ProfessorDTO from(Professor professor) {
        return new ProfessorDTO(
                professor.getId(),
                professor.getName(),
                professor.getEmail(),
                professor.getTitle()
        );
    }
}
