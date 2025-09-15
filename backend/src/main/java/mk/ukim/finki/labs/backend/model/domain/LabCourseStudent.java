package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(LabCourseStudentId.class)
@EqualsAndHashCode(of = {"labCourse", "student"})
public class LabCourseStudent {

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "lab_course_id")
    private LabCourse labCourse;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

//    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<StudentExerciseScore> studentExerciseScores;

}
