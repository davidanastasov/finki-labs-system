package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(
        name = "uk_labcourse_semester_subject", 
        columnNames = {"semester_code", "joined_subject_abbreviation"}
    )
})
public class LabCourse {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Semester semester;

    @ManyToOne
    private JoinedSubject joinedSubject;

    @ManyToMany
    private List<Professor> professors;

    @ManyToMany
    private List<Professor> assistants;

    @OneToMany(mappedBy = "labCourse", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LabCourseStudent> labCourseStudents = new ArrayList<>();

    @OneToMany(mappedBy = "labCourse", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> exercises;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private LabCourseStatus status;

    // Constructor without ID for creating new entities
    public LabCourse(Semester semester, JoinedSubject joinedSubject, 
                    List<Professor> professors, List<Professor> assistants, 
                    String description, LabCourseStatus status) {
        this.semester = semester;
        this.joinedSubject = joinedSubject;
        this.professors = professors;
        this.assistants = assistants;
        this.description = description;
        this.status = status;
    }
}
