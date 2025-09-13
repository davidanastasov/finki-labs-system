package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.Exercise;

import java.util.List;
import java.util.Optional;

public interface ExerciseService {
    
    List<Exercise> findByLabCourseId(Long labCourseId);
    
    Optional<Exercise> findById(Long id);
    
    Optional<Exercise> save(Exercise exercise);
    
    void deleteById(Long id);
    
    long countByLabCourseId(Long labCourseId);
}
