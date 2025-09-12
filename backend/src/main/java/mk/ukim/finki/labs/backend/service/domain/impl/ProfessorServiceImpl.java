package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.Professor;
import mk.ukim.finki.labs.backend.model.domain.ProfessorTitle;
import mk.ukim.finki.labs.backend.repository.ProfessorRepository;
import mk.ukim.finki.labs.backend.service.domain.ProfessorService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ProfessorServiceImpl implements ProfessorService {

    private final ProfessorRepository professorRepository;

    @Override
    public List<Professor> findAll() {
        return professorRepository.findAll();
    }

    @Override
    public List<Professor> findAllActive() {
        return professorRepository.findAllByTitleNot(ProfessorTitle.RETIRED);
    }
}
