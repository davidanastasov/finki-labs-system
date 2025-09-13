package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    
    @Query("SELECT e FROM Exercise e WHERE e.labCourse.id = :labCourseId ORDER BY e.labDate ASC NULLS LAST, e.dueDate ASC NULLS LAST, e.id ASC")
    List<Exercise> findByLabCourseId(@Param("labCourseId") Long labCourseId);
    
    long countByLabCourseId(Long labCourseId);
}
