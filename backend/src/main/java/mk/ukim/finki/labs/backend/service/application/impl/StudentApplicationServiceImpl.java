package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.PaginatedList;
import mk.ukim.finki.labs.backend.dto.student.StudentDTO;
import mk.ukim.finki.labs.backend.service.application.StudentApplicationService;
import mk.ukim.finki.labs.backend.service.domain.StudentService;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StudentApplicationServiceImpl implements StudentApplicationService {

    private final StudentService studentService;

    @Override
    public PaginatedList<StudentDTO> filter(String search, String studyProgramCode, Integer page, Integer pageSize) {
        var students = studentService.filter(search, studyProgramCode, page, pageSize);

        return new PaginatedList<>(
                students.getTotalElements(),
                students.stream()
                        .map(StudentDTO::from)
                        .collect(Collectors.toList())
        );
    }
}
