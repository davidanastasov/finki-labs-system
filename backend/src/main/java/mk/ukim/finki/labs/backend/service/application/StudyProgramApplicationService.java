package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.study_program.StudyProgramDTO;

import java.util.List;

public interface StudyProgramApplicationService {
    List<StudyProgramDTO> findAll();
}
