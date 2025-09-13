package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.exercise.CreateExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.UpdateExerciseDTO;
import mk.ukim.finki.labs.backend.service.application.ExerciseApplicationService;
import mk.ukim.finki.labs.backend.service.domain.ExerciseService;
import mk.ukim.finki.labs.backend.service.domain.LabCourseService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ExerciseApplicationServiceImpl implements ExerciseApplicationService {
    
    private final ExerciseService exerciseService;
    private final LabCourseService labCourseService;
    
    @Override
    public List<ExerciseDTO> findByLabCourseId(Long labCourseId) {
        return exerciseService.findByLabCourseId(labCourseId)
                .stream()
                .map(ExerciseDTO::from)
                .toList();
    }
    
    @Override
    public ExerciseDTO findById(Long id) {
        return exerciseService.findById(id)
                .map(ExerciseDTO::from)
                .orElseThrow(() -> new IllegalArgumentException("Exercise with id " + id + " not found"));
    }
    
    @Override
    public ExerciseDTO create(CreateExerciseDTO createDto) {
        var labCourse = labCourseService.findById(createDto.labCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Lab course with id " + createDto.labCourseId() + " not found"));
        
        var exercise = createDto.toExercise(labCourse);
        
        return exerciseService.save(exercise)
                .map(ExerciseDTO::from)
                .orElseThrow(() -> new RuntimeException("Failed to create exercise"));
    }
    
    @Override
    public ExerciseDTO update(Long id, UpdateExerciseDTO updateDto) {
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
                    
                    if (updateDto.filePath() != null) {
                        existingExercise.setFilePath(updateDto.filePath());
                    }
                    
                    if (updateDto.status() != null) {
                        existingExercise.setStatus(updateDto.status());
                    }
                    
                    return exerciseService.save(existingExercise)
                            .map(ExerciseDTO::from)
                            .orElseThrow(() -> new RuntimeException("Failed to update exercise"));
                })
                .orElseThrow(() -> new IllegalArgumentException("Exercise with id " + id + " not found"));
    }
    
    @Override
    public void deleteById(Long id) {
        exerciseService.deleteById(id);
    }
}
