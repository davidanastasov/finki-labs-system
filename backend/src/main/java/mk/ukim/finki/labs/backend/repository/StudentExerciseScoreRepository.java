package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.StudentExerciseScore;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentExerciseScoreRepository extends JpaSpecificationRepository<StudentExerciseScore, Long> {

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.exercise.id = :exerciseId ORDER BY s.labCourseStudent.student.index ASC")
    List<StudentExerciseScore> findByExerciseId(@Param("exerciseId") Long exerciseId);

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.labCourseStudent.student.index = :studentIndex AND s.exercise.id = :exerciseId")
    Optional<StudentExerciseScore> findByStudentIndexAndExerciseId(@Param("studentIndex") String studentIndex,
                                                                   @Param("exerciseId") Long exerciseId);

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.labCourseStudent.labCourse.id = :courseId")
    List<StudentExerciseScore> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT s FROM StudentExerciseScore s WHERE s.labCourseStudent.student.index = :studentIndex AND s.labCourseStudent.labCourse.id = :courseId")
    List<StudentExerciseScore> findByStudentIndexAndCourseId(@Param("studentIndex") String studentIndex,
                                                             @Param("courseId") Long courseId);

}
