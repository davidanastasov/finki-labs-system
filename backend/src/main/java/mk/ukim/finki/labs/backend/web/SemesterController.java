package mk.ukim.finki.labs.backend.web;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.semester.SemesterDTO;
import mk.ukim.finki.labs.backend.service.application.SemesterApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/semesters")
public class SemesterController {

    private final SemesterApplicationService semesterApplicationService;

    @GetMapping
    public ResponseEntity<List<SemesterDTO>> findAll() {
        var semesters = semesterApplicationService.findAll();
        return ResponseEntity.ok(semesters);
    }
}
