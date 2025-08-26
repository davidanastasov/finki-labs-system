package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.PaginatedList;
import mk.ukim.finki.labs.backend.dto.student.StudentDTO;
import org.springframework.stereotype.Service;

@Service
public interface StudentApplicationService {
    PaginatedList<StudentDTO> filter(String search, String studyProgramCode, Integer pageNum, Integer pageSize);

}
