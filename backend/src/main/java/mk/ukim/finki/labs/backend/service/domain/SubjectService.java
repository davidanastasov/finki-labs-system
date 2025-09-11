package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.JoinedSubject;

import java.util.List;

public interface SubjectService {
    List<JoinedSubject> findAll();
}
