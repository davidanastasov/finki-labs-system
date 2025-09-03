package mk.ukim.finki.labs.backend.web;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.study_program.StudyProgramDTO;
import mk.ukim.finki.labs.backend.service.application.StudyProgramApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/study-programs")
public class StudyProgramController {

    private final StudyProgramApplicationService studyProgramApplicationService;

    @GetMapping
    public ResponseEntity<List<StudyProgramDTO>> findAll(){
        var studyPrograms = studyProgramApplicationService.findAll();
        return ResponseEntity.ok(studyPrograms);
    }
}
