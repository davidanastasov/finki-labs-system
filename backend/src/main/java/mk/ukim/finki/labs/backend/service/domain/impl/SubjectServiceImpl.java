package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.JoinedSubject;
import mk.ukim.finki.labs.backend.repository.JoinedSubjectRepository;
import mk.ukim.finki.labs.backend.service.domain.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class SubjectServiceImpl implements SubjectService {

    private final JoinedSubjectRepository joinedSubjectRepository;

    @Override
    public List<JoinedSubject> findAll() {
        return joinedSubjectRepository.findAll();
    }
}
