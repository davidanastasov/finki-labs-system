package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(
        name = "uk_student_exercise_score", 
        columnNames = {"student_id", "exercise_id"}
    )
})
public class StudentExerciseScore {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @ManyToOne
    private LabCourseStudent labCourseStudent;

    private Integer corePoints;

    private LocalDateTime dateGraded;

    // Constructor without ID for creating new entities
    public StudentExerciseScore(Student student, Exercise exercise, Integer corePoints, 
                               LocalDateTime dateGraded) {
        this.student = student;
        this.exercise = exercise;
        this.corePoints = corePoints;
        this.dateGraded = dateGraded;
    }
}
