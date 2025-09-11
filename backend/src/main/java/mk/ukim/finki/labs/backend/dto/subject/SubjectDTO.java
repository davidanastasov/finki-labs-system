package mk.ukim.finki.labs.backend.dto.subject;

import mk.ukim.finki.labs.backend.model.domain.JoinedSubject;
import mk.ukim.finki.labs.backend.model.domain.SemesterType;

public record SubjectDTO(
        String code,
        String name,
        String abbreviation,
        SemesterType semester
) {

    public static SubjectDTO from(JoinedSubject joinedSubject) {
        return new SubjectDTO(
                getMainCode(joinedSubject),
                joinedSubject.getName(),
                joinedSubject.getAbbreviation(),
                joinedSubject.getSemesterType()
        );
    }
    
    private static String getMainCode(JoinedSubject joinedSubject) {
        // Return the main subject's ID if available, otherwise use the abbreviation
        if (joinedSubject.getMainSubject() != null) {
            return joinedSubject.getMainSubject().getId();
        }
        return joinedSubject.getAbbreviation();
    }
}
