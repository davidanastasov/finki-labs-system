package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface LabCourseService {
    
    Page<LabCourse> filter(String search, String semesterCode, Integer page, Integer pageSize);
    
    List<LabCourse> findAll();

    Optional<LabCourse> findById(Long id);
    
    Optional<LabCourse> save(LabCourse labCourse);
    
    Optional<LabCourse> update(Long id, LabCourse labCourse);
    
    void deleteById(Long id);

}
