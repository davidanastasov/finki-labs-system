package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.StudentExerciseScore;

import java.util.List;
import java.util.Optional;

public interface StudentExerciseScoreService {
    
    List<StudentExerciseScore> findByExerciseId(Long exerciseId);
    
    Optional<StudentExerciseScore> findByStudentIndexAndExerciseId(String studentIndex, Long exerciseId);
    
    List<StudentExerciseScore> findByCourseId(Long courseId);
    
    List<StudentExerciseScore> findByStudentIndexAndCourseId(String studentIndex, Long courseId);
    
    Optional<StudentExerciseScore> save(StudentExerciseScore score);
    
    void deleteByStudentIndexAndExerciseId(String studentIndex, Long exerciseId);
}
