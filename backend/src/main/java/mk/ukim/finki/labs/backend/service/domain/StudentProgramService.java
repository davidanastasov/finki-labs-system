package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.StudyProgram;

import java.util.List;

public interface StudentProgramService {

    List<StudyProgram> findAll();
}
