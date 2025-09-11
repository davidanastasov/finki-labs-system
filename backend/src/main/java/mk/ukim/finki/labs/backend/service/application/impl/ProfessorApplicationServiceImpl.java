package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.professor.ProfessorDTO;
import mk.ukim.finki.labs.backend.service.application.ProfessorApplicationService;
import mk.ukim.finki.labs.backend.service.domain.ProfessorService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ProfessorApplicationServiceImpl implements ProfessorApplicationService {

    private final ProfessorService professorService;

    @Override
    public List<ProfessorDTO> findAll() {
        return professorService.findAllActive()
                .stream()
                .map(ProfessorDTO::from)
                .toList();
    }
}
