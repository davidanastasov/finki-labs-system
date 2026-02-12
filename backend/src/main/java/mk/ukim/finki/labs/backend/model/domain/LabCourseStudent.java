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
    @JoinColumn(name = "student_index")
    private Student student;

    @OneToMany(mappedBy = "labCourseStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentExerciseScore> studentExerciseScores;

    @Enumerated(EnumType.STRING)
    private SignatureStatus signatureStatus;

    public LabCourseStudent(LabCourse labCourse, Student student) {
        this.labCourse = labCourse;
        this.student = student;
        this.signatureStatus = SignatureStatus.NOT_ELIGIBLE;
    }

    public long getCompletedExercisesCount() {
        if (studentExerciseScores == null) return 0;

        return studentExerciseScores.stream()
                .filter(StudentExerciseScore::isCompleted)
                .count();
    }
}
