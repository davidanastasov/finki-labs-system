package mk.ukim.finki.labs.backend.web;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDetailsDTO;
import mk.ukim.finki.labs.backend.dto.exercise.UpdateExerciseDTO;
import mk.ukim.finki.labs.backend.service.application.ExerciseApplicationService;
import mk.ukim.finki.labs.backend.service.domain.ExerciseFileService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/exercises")
@Validated
public class ExerciseController {
    
    private final ExerciseApplicationService exerciseApplicationService;
    private final ExerciseFileService fileService;

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDetailsDTO> findById(@PathVariable Long id) {
        var exercise = exerciseApplicationService.findById(id);
        return ResponseEntity.ok(exercise);
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExerciseDetailsDTO> update(
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateExerciseDTO updateDto,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "removeFiles", required = false) List<String> removeFiles) {

        var exercise = exerciseApplicationService.updateWithFiles(id, updateDto, files, removeFiles);
        return ResponseEntity.ok(exercise);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        exerciseApplicationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/files/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String id) {
        var downloadResult = fileService.downloadFileWithMetadata(id);
        var exerciseFile = downloadResult.exerciseFile();
        var fileData = downloadResult.fileData();
        ByteArrayResource resource = new ByteArrayResource(fileData);
        
        String contentType = exerciseFile.getContentType() != null
            ? exerciseFile.getContentType() 
            : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + exerciseFile.getFileName() + "\"")
            .contentType(MediaType.parseMediaType(contentType))
            .contentLength(fileData.length)
            .body(resource);
    }

}
