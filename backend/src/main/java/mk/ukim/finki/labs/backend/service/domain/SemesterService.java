package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.Semester;

import java.util.List;

public interface SemesterService {
    List<Semester> findAll();
}
