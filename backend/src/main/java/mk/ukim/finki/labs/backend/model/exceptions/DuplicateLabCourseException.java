package mk.ukim.finki.labs.backend.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateLabCourseException extends RuntimeException {
    
    public DuplicateLabCourseException(String semesterCode, String subjectAbbreviation) {
        super("A lab course for subject '" + subjectAbbreviation + "' in semester '" + semesterCode + "' already exists");
    }
}
