package mk.ukim.finki.labs.backend.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.PaginatedList;
import mk.ukim.finki.labs.backend.dto.exercise.CreateExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDetailsDTO;
import mk.ukim.finki.labs.backend.dto.lab_course.*;
import mk.ukim.finki.labs.backend.service.application.ExerciseApplicationService;
import mk.ukim.finki.labs.backend.service.application.LabCourseApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/lab-courses")
@Validated
public class LabCourseController {
    
    private final LabCourseApplicationService labCourseApplicationService;
    private final ExerciseApplicationService exerciseApplicationService;
    
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

    @GetMapping("/{courseId}/students/filter")
    public ResponseEntity<PaginatedList<LabCourseStudentDTO>> filterStudents(
            @PathVariable Long courseId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String studyProgramCode,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) Integer pageSize
    ){
        var students = labCourseApplicationService.filterStudents(courseId, search, studyProgramCode, page-1, pageSize);
        return ResponseEntity.ok(students);
    }

    @PostMapping("{courseId}/students")
    public ResponseEntity<Void> addStudentsToCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody AddStudentsToCourseDTO addStudentsToCourseDTO
            ){
        labCourseApplicationService.addStudentsToCourse(courseId, addStudentsToCourseDTO.studentIds());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("{courseId}/students/{studentId}")
    public ResponseEntity<Void> removeStudentFromCourse(
            @PathVariable Long courseId,
            @PathVariable String studentId
    ){
        labCourseApplicationService.removeStudentFromCourse(courseId, studentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{courseId}/exercises")
    public ResponseEntity<List<ExerciseDTO>> findExercisesByLabCourseId(@PathVariable Long courseId) {
        var exercises = exerciseApplicationService.findByLabCourseId(courseId);
        return ResponseEntity.ok(exercises);
    }

    @PostMapping(value= "{courseId}/exercises", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExerciseDetailsDTO> createExerciseForLabCourse(
            @PathVariable Long courseId,
            @Valid @ModelAttribute CreateExerciseDTO createDto,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {

        var exercise = exerciseApplicationService.createWithFiles(courseId, createDto, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(exercise);
    }

    @GetMapping("{courseId}/students")
    public List<LabCourseStudentDTO> getStudents(@PathVariable Long courseId){
        return labCourseApplicationService.getStudentsWithSignatureStatus(courseId);
    }

    @PostMapping("{courseId}/update-signature")
    public void updateSignature(@PathVariable Long courseId){
        labCourseApplicationService.updateSignatureStatusForCourse(courseId);
    }

    @PutMapping("{courseId}/update-signature-requirements")
    public ResponseEntity<Void> updateSignatureRequirements(
            @PathVariable Long courseId,
            @Valid @RequestBody UpdateSignatureRequirementsDTO updateDto
    ) {
        labCourseApplicationService.updateRequiredExercisesForSignature(courseId, updateDto);
        return ResponseEntity.ok().build();
    }

}
