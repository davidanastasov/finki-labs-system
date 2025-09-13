package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exercise")
public class Exercise {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "lab_date")
    private LocalDate labDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints;

    @Column(name = "file_path")
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_course_id", nullable = false)
    private LabCourse labCourse;

    @Enumerated(EnumType.STRING)
    private ExerciseStatus status;

    // Constructor without ID for creating new entities
    public Exercise(String title, String description, LocalDate labDate, 
                   LocalDate dueDate, Integer totalPoints, String filePath,
                   LabCourse labCourse, ExerciseStatus status) {
        this.title = title;
        this.description = description;
        this.labDate = labDate;
        this.dueDate = dueDate;
        this.totalPoints = totalPoints;
        this.filePath = filePath;
        this.labCourse = labCourse;
        this.status = status;
    }
}
