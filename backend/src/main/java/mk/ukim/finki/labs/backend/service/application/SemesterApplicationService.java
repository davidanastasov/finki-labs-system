package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.semester.SemesterDTO;

import java.util.List;

public interface SemesterApplicationService {
    List<SemesterDTO> findAll();
}
