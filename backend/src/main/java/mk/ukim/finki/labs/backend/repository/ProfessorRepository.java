package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.Professor;
import mk.ukim.finki.labs.backend.model.domain.ProfessorTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, String> {
    List<Professor> findAllByTitleNot(ProfessorTitle title);
}
