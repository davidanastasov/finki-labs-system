package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.exercise.CreateExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.UpdateExerciseDTO;

import java.util.List;

public interface ExerciseApplicationService {
    
    List<ExerciseDTO> findByLabCourseId(Long labCourseId);
    
    ExerciseDTO findById(Long id);
    
    ExerciseDTO create(CreateExerciseDTO createDto);
    
    ExerciseDTO update(Long id, UpdateExerciseDTO updateDto);
    
    void deleteById(Long id);
}
