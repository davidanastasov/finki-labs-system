package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.ExerciseFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExerciseFileRepository extends JpaRepository<ExerciseFile, UUID> {
    List<ExerciseFile> findByExerciseId(Long exerciseId);
    void deleteByExerciseId(Long exerciseId);
}
