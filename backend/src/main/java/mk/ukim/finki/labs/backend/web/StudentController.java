package mk.ukim.finki.labs.backend.web;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.ApiResponse;
import mk.ukim.finki.labs.backend.dto.PaginatedList;
import mk.ukim.finki.labs.backend.dto.student.StudentDTO;
import mk.ukim.finki.labs.backend.service.application.StudentApplicationService;
import mk.ukim.finki.labs.backend.util.ResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/students")
public class StudentController {

    private final StudentApplicationService studentApplicationService;

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<PaginatedList<StudentDTO>>> filter(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String studyProgramCode,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        var students = studentApplicationService.filter(search, studyProgramCode, pageNum-1, pageSize);
        return ResponseUtil.ok(students);
    }
}
