package mk.ukim.finki.labs.backend.web;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.professor.ProfessorDTO;
import mk.ukim.finki.labs.backend.service.application.ProfessorApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/professors")
public class ProfessorController {

    private final ProfessorApplicationService professorApplicationService;

    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> findAll() {
        var professors = professorApplicationService.findAll();
        return ResponseEntity.ok(professors);
    }
}
