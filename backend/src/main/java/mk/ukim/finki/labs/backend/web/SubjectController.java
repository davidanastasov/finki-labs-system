package mk.ukim.finki.labs.backend.web;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.subject.SubjectDTO;
import mk.ukim.finki.labs.backend.service.application.SubjectApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectApplicationService subjectApplicationService;

    @GetMapping
    public ResponseEntity<List<SubjectDTO>> findAll() {
        var subjects = subjectApplicationService.findAll();
        return ResponseEntity.ok(subjects);
    }
}
