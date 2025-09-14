package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import mk.ukim.finki.labs.backend.model.domain.Student;
import mk.ukim.finki.labs.backend.model.domain.StudentExerciseScore;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentExerciseScoreRepository extends JpaSpecificationRepository<StudentExerciseScore, Long> {

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.exercise.id = :exerciseId ORDER BY s.student.index ASC")
    List<StudentExerciseScore> findByExerciseId(@Param("exerciseId") Long exerciseId);

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.student.index = :studentIndex AND s.exercise.id = :exerciseId")
    Optional<StudentExerciseScore> findByStudentIndexAndExerciseId(@Param("studentIndex") String studentIndex, 
                                                                   @Param("exerciseId") Long exerciseId);

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.exercise.labCourse.id = :courseId")
    List<StudentExerciseScore> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.student.index = :studentIndex AND s.exercise.labCourse.id = :courseId")
    List<StudentExerciseScore> findByStudentIndexAndCourseId(@Param("studentIndex") String studentIndex, 
                                                             @Param("courseId") Long courseId);

    List<StudentExerciseScore> findByStudentAndExerciseLabCourse(Student student, LabCourse labCourse);
    void deleteByStudentIndexAndExerciseId(String studentIndex, Long exerciseId);
}
