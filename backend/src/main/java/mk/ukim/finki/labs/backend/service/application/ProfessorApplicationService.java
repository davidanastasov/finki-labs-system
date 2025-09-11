package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.professor.ProfessorDTO;

import java.util.List;

public interface ProfessorApplicationService {
    List<ProfessorDTO> findAll();
}
