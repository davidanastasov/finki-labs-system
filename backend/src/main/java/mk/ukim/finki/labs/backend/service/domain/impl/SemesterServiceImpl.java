package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.Semester;
import mk.ukim.finki.labs.backend.repository.SemesterRepository;
import mk.ukim.finki.labs.backend.service.domain.SemesterService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;

    @Override
    public List<Semester> findAll() {
        return semesterRepository
                .findAll(Sort.by(Sort.Order.desc("startDate")))
                .stream().filter(s -> s.getStartDate() != null)
                .toList();
    }
}
