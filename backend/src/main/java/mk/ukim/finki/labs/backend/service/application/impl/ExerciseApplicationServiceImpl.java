package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.exercise.CreateExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDetailsDTO;
import mk.ukim.finki.labs.backend.dto.exercise.UpdateExerciseDTO;
import mk.ukim.finki.labs.backend.model.domain.ExerciseFile;
import mk.ukim.finki.labs.backend.service.application.ExerciseApplicationService;
import mk.ukim.finki.labs.backend.service.domain.ExerciseService;
import mk.ukim.finki.labs.backend.service.domain.ExerciseFileService;
import mk.ukim.finki.labs.backend.service.domain.LabCourseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class ExerciseApplicationServiceImpl implements ExerciseApplicationService {
    
    private final ExerciseService exerciseService;
    private final LabCourseService labCourseService;
    private final ExerciseFileService fileService;

    @Override
    public List<ExerciseDTO> findByLabCourseId(Long labCourseId) {
        return exerciseService.findByLabCourseId(labCourseId)
                .stream()
                .map(ExerciseDTO::from)
                .toList();
    }
    
    @Override
    public ExerciseDetailsDTO findById(Long id) {
        return exerciseService.findById(id)
                .map(ExerciseDetailsDTO::from)
                .orElseThrow(() -> new IllegalArgumentException("Exercise with id " + id + " not found"));
    }
    
    @Override
    public ExerciseDetailsDTO createWithFiles(CreateExerciseDTO createDto, List<MultipartFile> files) {
        var labCourse = labCourseService.findById(createDto.labCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Lab course with id " + createDto.labCourseId() + " not found"));
        
        var exercise = createDto.toExercise(labCourse);
        
        // Save exercise first to get ID
        var savedExercise = exerciseService.save(exercise)
                .orElseThrow(() -> new RuntimeException("Failed to create exercise"));
        
        // Handle file uploads
        if (files != null && !files.isEmpty() && !files.getFirst().isEmpty()) {
            var savedFiles = fileService.saveFiles(files, savedExercise);
            savedExercise.getFiles().addAll(savedFiles);
        }
        
        return ExerciseDetailsDTO.from(savedExercise);
    }

    @Override
    public ExerciseDetailsDTO updateWithFiles(Long id, UpdateExerciseDTO updateDto, List<MultipartFile> files, List<String> removeFiles) {
        return exerciseService.findById(id)
                .map(existingExercise -> {
                    if (updateDto.title() != null) {
                        existingExercise.setTitle(updateDto.title());
                    }
                    
                    if (updateDto.description() != null) {
                        existingExercise.setDescription(updateDto.description());
                    }
                    
                    if (updateDto.labDate() != null) {
                        existingExercise.setLabDate(updateDto.labDate());
                    }
                    
                    if (updateDto.dueDate() != null) {
                        existingExercise.setDueDate(updateDto.dueDate());
                    }
                    
                    if (updateDto.totalPoints() != null) {
                        existingExercise.setTotalPoints(updateDto.totalPoints());
                    }
                    
                    if (updateDto.status() != null) {
                        existingExercise.setStatus(updateDto.status());
                    }
                    
                    // Handle file removals
                    if (removeFiles != null && !removeFiles.isEmpty()) {
                        List<ExerciseFile> filesToRemove = new ArrayList<>();
                        for (ExerciseFile file : existingExercise.getFiles()) {
                            if (removeFiles.contains(file.getId().toString())) {
                                filesToRemove.add(file);
                            }
                        }
                        
                        for (ExerciseFile fileToRemove : filesToRemove) {
                            existingExercise.getFiles().remove(fileToRemove);
                            fileService.deleteFile(fileToRemove);
                        }
                    }
                    
                    // Handle new file uploads
                    if (files != null && !files.isEmpty() && !files.getFirst().isEmpty()) {
                        var newFiles = fileService.saveFiles(files, existingExercise);
                        existingExercise.getFiles().addAll(newFiles);
                    }
                    
                    return exerciseService.save(existingExercise)
                            .map(ExerciseDetailsDTO::from)
                            .orElseThrow(() -> new RuntimeException("Failed to update exercise"));
                })
                .orElseThrow(() -> new IllegalArgumentException("Exercise with id " + id + " not found"));
    }
    
    @Override
    public void deleteById(Long id) {
        exerciseService.deleteById(id);
        fileService.deleteFilesByExerciseId(id);
    }
}
