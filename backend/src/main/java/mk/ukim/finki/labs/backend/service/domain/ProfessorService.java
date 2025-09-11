package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.Professor;

import java.util.List;

public interface ProfessorService {
    List<Professor> findAll();
    List<Professor> findAllActive();
}
