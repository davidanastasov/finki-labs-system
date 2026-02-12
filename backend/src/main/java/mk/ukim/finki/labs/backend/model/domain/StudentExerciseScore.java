package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(
        name = "uk_labcoursestudent_exercise_score",
        columnNames = {"lab_course_id", "student_index", "exercise_id"}
    )
})
public class StudentExerciseScore {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumns({
        @JoinColumn(name = "lab_course_id", referencedColumnName = "lab_course_id"),
        @JoinColumn(name = "student_index", referencedColumnName = "student_index")
    })
    private LabCourseStudent labCourseStudent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    private Integer corePoints;

    private LocalDateTime dateGraded;

    // Constructor without ID for creating new entities
    public StudentExerciseScore(LabCourseStudent labCourseStudent, Exercise exercise,
                               Integer corePoints, LocalDateTime dateGraded) {
        this.labCourseStudent = labCourseStudent;
        this.exercise = exercise;
        this.corePoints = corePoints;
        this.dateGraded = dateGraded;
    }

    public Student getStudent() {
        return labCourseStudent != null ? labCourseStudent.getStudent() : null;
    }

    public LabCourse getLabCourse() {
        return labCourseStudent != null ? labCourseStudent.getLabCourse() : null;
    }

    public boolean isCompleted() {
        Integer minPoints = Optional.ofNullable(exercise.getMinPointsForSignature()).orElse(0);
        return corePoints != null && corePoints >= minPoints;
    }
}
