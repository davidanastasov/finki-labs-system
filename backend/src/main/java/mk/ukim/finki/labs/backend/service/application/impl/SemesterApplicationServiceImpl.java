package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.semester.SemesterDTO;
import mk.ukim.finki.labs.backend.service.application.SemesterApplicationService;
import mk.ukim.finki.labs.backend.service.domain.SemesterService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class SemesterApplicationServiceImpl implements SemesterApplicationService {

    private final SemesterService semesterService;

    @Override
    public List<SemesterDTO> findAll() {
        return semesterService.findAll()
                .stream()
                .map(SemesterDTO::from)
                .toList();
    }
}
