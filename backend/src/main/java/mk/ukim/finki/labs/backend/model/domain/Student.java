package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Student {

    @Id
    @Column(name = "student_index")
    private String index;

    private String email;

    private String name;

    private String lastName;

    private String parentName;

    @ManyToOne
    private StudyProgram studyProgram;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LabCourseStudent> courseEnrollments = new ArrayList<>();

    public Student(String index, String email, String name, String lastName, String parentName, StudyProgram studyProgram) {
        this.index = index;
        this.email = email;
        this.name = name;
        this.lastName = lastName;
        this.parentName = parentName;
        this.studyProgram = studyProgram;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Student student = (Student) o;
        return getIndex() != null && Objects.equals(getIndex(), student.getIndex());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
