package mk.ukim.finki.labs.backend.model.domain;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"labCourse", "student"})
public class LabCourseStudentId implements Serializable {

    private Long labCourse;
    private String student;

}