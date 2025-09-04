package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.Student;
import mk.ukim.finki.labs.backend.repository.StudentRepository;
import mk.ukim.finki.labs.backend.service.domain.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import static mk.ukim.finki.labs.backend.service.specification.FieldFilterSpecification.filterContainsText;
import static mk.ukim.finki.labs.backend.service.specification.FieldFilterSpecification.filterEquals;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;

    @Override
    public Page<Student> filter(String search, String studyProgramCode, Integer page, Integer pageSize) {

        Specification<Student> fullNameSpec = (root, query, cb) -> {
            if (search == null || search.isEmpty()) return null;

            String value = "%" + search.toLowerCase() + "%";
            return cb.like(cb.lower(cb.concat(cb.concat(root.get("name"), " "), root.get("lastName"))), value);
        };

        Specification<Student> specification = Specification
                .allOf(
                        Specification.anyOf(
                            fullNameSpec,
                            filterContainsText(Student.class, "index", search)
                        ),
                        filterEquals(Student.class, "studyProgram.code", studyProgramCode)
                );

        return this.studentRepository.findAll(
                specification,
                PageRequest.of(page, pageSize)
        );
    }

}
