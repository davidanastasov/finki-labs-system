package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.Student;
import org.springframework.data.domain.Page;

public interface StudentService {
    Page<Student> filter(String search, String studyProgramCode, Integer page, Integer pageSize);
}
