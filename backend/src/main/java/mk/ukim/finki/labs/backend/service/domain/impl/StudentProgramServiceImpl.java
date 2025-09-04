package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.StudyProgram;
import mk.ukim.finki.labs.backend.repository.StudyProgramRepository;
import mk.ukim.finki.labs.backend.service.domain.StudentProgramService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentProgramServiceImpl implements StudentProgramService {

    private final StudyProgramRepository studyProgramRepository;

    @Override
    public List<StudyProgram> findAll() {
        return studyProgramRepository.findAll();
    }
}
