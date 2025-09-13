package mk.ukim.finki.labs.backend.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ExerciseFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String fileName;

    private String filePath;

    private Long fileSize;

    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    private Exercise exercise;

    // Constructor without ID for creating new entities
    public ExerciseFile(String fileName, String filePath,
                        Long fileSize, String contentType, Exercise exercise) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.exercise = exercise;
    }

}
