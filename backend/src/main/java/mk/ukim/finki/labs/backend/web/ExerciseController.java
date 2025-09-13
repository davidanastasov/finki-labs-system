package mk.ukim.finki.labs.backend.web;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.exercise.CreateExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.UpdateExerciseDTO;
import mk.ukim.finki.labs.backend.service.application.ExerciseApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/exercises")
@Validated
public class ExerciseController {
    
    private final ExerciseApplicationService exerciseApplicationService;
    
    @GetMapping("/lab-course/{labCourseId}")
    public ResponseEntity<List<ExerciseDTO>> findByLabCourseId(@PathVariable Long labCourseId) {
        var exercises = exerciseApplicationService.findByLabCourseId(labCourseId);
        return ResponseEntity.ok(exercises);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> findById(@PathVariable Long id) {
        var exercise = exerciseApplicationService.findById(id);
        return ResponseEntity.ok(exercise);
    }
    
    @PostMapping
    public ResponseEntity<ExerciseDTO> create(@Valid @RequestBody CreateExerciseDTO createDto) {
        var exercise = exerciseApplicationService.create(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(exercise);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExerciseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExerciseDTO updateDto
    ) {
        var exercise = exerciseApplicationService.update(id, updateDto);
        return ResponseEntity.ok(exercise);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        exerciseApplicationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
