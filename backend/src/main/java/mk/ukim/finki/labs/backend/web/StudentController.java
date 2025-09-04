package mk.ukim.finki.labs.backend.web;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.PaginatedList;
import mk.ukim.finki.labs.backend.dto.student.StudentDTO;
import mk.ukim.finki.labs.backend.service.application.StudentApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/students")
@Validated
public class StudentController {

    private final StudentApplicationService studentApplicationService;

    @GetMapping("/filter")
    public ResponseEntity<PaginatedList<StudentDTO>> filter(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String studyProgramCode,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) Integer pageSize
    ) {
        var students = studentApplicationService.filter(search, studyProgramCode, page-1, pageSize);
        return ResponseEntity.ok(students);
    }
}
