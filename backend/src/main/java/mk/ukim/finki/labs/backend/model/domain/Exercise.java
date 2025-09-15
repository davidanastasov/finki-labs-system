package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Exercise {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @Column(length = 10_000)
    private String description;

    private LocalDate labDate;

    private LocalDate dueDate;

    private Integer totalPoints;

    private Integer minPointsForSignature;

    @ManyToOne(fetch = FetchType.LAZY)
    private LabCourse labCourse;

    @Enumerated(EnumType.STRING)
    private ExerciseStatus status;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseFile> files = new ArrayList<>();

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentExerciseScore> scores = new ArrayList<>();

    // Constructor without ID for creating new entities
    public Exercise(String title, String description, LocalDate labDate, 
                   LocalDate dueDate, Integer totalPoints,
                   LabCourse labCourse, ExerciseStatus status) {
        this.title = title;
        this.description = description;
        this.labDate = labDate;
        this.dueDate = dueDate;
        this.totalPoints = totalPoints;
        this.labCourse = labCourse;
        this.status = status;
    }
}
