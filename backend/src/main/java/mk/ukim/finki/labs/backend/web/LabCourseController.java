package mk.ukim.finki.labs.backend.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.PaginatedList;
import mk.ukim.finki.labs.backend.dto.lab_course.CreateLabCourseDTO;
import mk.ukim.finki.labs.backend.dto.lab_course.LabCourseDTO;
import mk.ukim.finki.labs.backend.dto.lab_course.UpdateLabCourseDTO;
import mk.ukim.finki.labs.backend.service.application.LabCourseApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/lab-courses")
@Validated
public class LabCourseController {
    
    private final LabCourseApplicationService labCourseApplicationService;
    
    @GetMapping("/filter")
    public ResponseEntity<PaginatedList<LabCourseDTO>> filter(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String semesterCode,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) Integer pageSize
    ) {
        var courses = labCourseApplicationService.filter(search, semesterCode, page-1, pageSize);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LabCourseDTO> findById(@PathVariable Long id) {
        var course = labCourseApplicationService.findById(id);
        return ResponseEntity.ok(course);
    }
    
    @PostMapping
    public ResponseEntity<LabCourseDTO> create(@Valid @RequestBody CreateLabCourseDTO createDto) {
        var course = labCourseApplicationService.create(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(course);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<LabCourseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLabCourseDTO updateDto
    ) {
        var course = labCourseApplicationService.update(id, updateDto);
        return ResponseEntity.ok(course);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        labCourseApplicationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
