package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.study_program.StudyProgramDTO;
import mk.ukim.finki.labs.backend.service.application.StudyProgramApplicationService;
import mk.ukim.finki.labs.backend.service.domain.StudentProgramService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudyProgramApplicationServiceImpl implements StudyProgramApplicationService {

    private final StudentProgramService studentProgramService;

    @Override
    public List<StudyProgramDTO> findAll() {
        return studentProgramService.findAll()
                .stream()
                .map(StudyProgramDTO::from).toList();
    }
}
