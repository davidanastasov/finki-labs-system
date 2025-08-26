package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.StudyProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyProgramRepository extends JpaRepository<StudyProgram, String> {
}
