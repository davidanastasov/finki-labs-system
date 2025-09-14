package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.*;

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

    @Enumerated(EnumType.STRING)
    private SignatureStatus signatureStatus;

    public LabCourseStudent(LabCourse labCourse, Student student) {
        this.labCourse = labCourse;
        this.student = student;
        this.signatureStatus = SignatureStatus.NOT_ELIGIBLE;
    }
}
