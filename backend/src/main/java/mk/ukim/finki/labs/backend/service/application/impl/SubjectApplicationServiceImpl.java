package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.subject.SubjectDTO;
import mk.ukim.finki.labs.backend.service.application.SubjectApplicationService;
import mk.ukim.finki.labs.backend.service.domain.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class SubjectApplicationServiceImpl implements SubjectApplicationService {

    private final SubjectService subjectService;

    @Override
    public List<SubjectDTO> findAll() {
        return subjectService.findAll()
                .stream()
                .map(SubjectDTO::from)
                .toList();
    }
}
