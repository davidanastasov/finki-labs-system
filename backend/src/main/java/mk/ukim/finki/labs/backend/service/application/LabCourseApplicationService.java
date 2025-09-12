package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.lab_course.CreateLabCourseDTO;
import mk.ukim.finki.labs.backend.dto.lab_course.LabCourseDTO;
import mk.ukim.finki.labs.backend.dto.lab_course.UpdateLabCourseDTO;

import java.util.List;

public interface LabCourseApplicationService {
    
    List<LabCourseDTO> findAll();

    LabCourseDTO findById(Long id);
    
    LabCourseDTO create(CreateLabCourseDTO createDto);
    
    LabCourseDTO update(Long id, UpdateLabCourseDTO updateDto);
    
    void deleteById(Long id);
}
