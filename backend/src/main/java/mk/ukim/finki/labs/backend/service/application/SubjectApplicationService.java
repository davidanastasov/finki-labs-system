package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.subject.SubjectDTO;

import java.util.List;

public interface SubjectApplicationService {
    List<SubjectDTO> findAll();
}
