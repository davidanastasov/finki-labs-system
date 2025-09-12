package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.lab_course.CreateLabCourseDTO;
import mk.ukim.finki.labs.backend.dto.lab_course.LabCourseDTO;
import mk.ukim.finki.labs.backend.dto.lab_course.UpdateLabCourseDTO;
import mk.ukim.finki.labs.backend.repository.JoinedSubjectRepository;
import mk.ukim.finki.labs.backend.repository.ProfessorRepository;
import mk.ukim.finki.labs.backend.repository.SemesterRepository;
import mk.ukim.finki.labs.backend.service.application.LabCourseApplicationService;
import mk.ukim.finki.labs.backend.service.domain.LabCourseService;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class LabCourseApplicationServiceImpl implements LabCourseApplicationService {
    
    private final LabCourseService labCourseService;
    private final SemesterRepository semesterRepository;
    private final JoinedSubjectRepository joinedSubjectRepository;
    private final ProfessorRepository professorRepository;
    
    @Override
    public List<LabCourseDTO> findAll() {
        return labCourseService.findAll()
                .stream()
                .map(LabCourseDTO::from)
                .toList();
    }
    
    @Override
    public LabCourseDTO findById(Long id) {
        return labCourseService.findById(id)
                .map(LabCourseDTO::from)
                .orElseThrow(() -> new IllegalArgumentException("LabCourse with id " + id + " not found"));
    }
    
    @Override
    public LabCourseDTO create(CreateLabCourseDTO createDto) {
        var semester = semesterRepository.findById(createDto.semesterCode())
                .orElseThrow(() -> new IllegalArgumentException("Semester with code " + createDto.semesterCode() + " not found"));
        
        var subject = joinedSubjectRepository.findById(createDto.subjectAbbreviation())
                .orElseThrow(() -> new IllegalArgumentException("Subject with abbreviation " + createDto.subjectAbbreviation() + " not found"));
        
        var professors = professorRepository.findAllById(createDto.professorIds());
        if (professors.size() != createDto.professorIds().size()) {
            throw new IllegalArgumentException("One or more professors not found");
        }

        var assistants = professorRepository.findAllById(createDto.assistantIds() != null ? createDto.assistantIds() : List.of());
        if (createDto.assistantIds() != null && assistants.size() != createDto.assistantIds().size()) {
            throw new IllegalArgumentException("One or more assistants not found");
        }
        
        return labCourseService.save(createDto.toLabCourse(semester, subject, professors, assistants))
                .map(LabCourseDTO::from)
                .orElseThrow(() -> new RuntimeException("Failed to create lab course"));
    }
    
    @Override
    public LabCourseDTO update(Long id, UpdateLabCourseDTO updateDto) {
        var semester = semesterRepository.findById(updateDto.semesterCode())
                .orElseThrow(() -> new IllegalArgumentException("Semester with code " + updateDto.semesterCode() + " not found"));
        
        var subject = joinedSubjectRepository.findById(updateDto.subjectAbbreviation())
                .orElseThrow(() -> new IllegalArgumentException("Subject with abbreviation " + updateDto.subjectAbbreviation() + " not found"));
        
        var professors = professorRepository.findAllById(updateDto.professorIds());
        if (professors.size() != updateDto.professorIds().size()) {
            throw new IllegalArgumentException("One or more professors not found");
        }

        var assistants = professorRepository.findAllById(updateDto.assistantIds() != null ? updateDto.assistantIds() : List.of());
        if (updateDto.assistantIds() != null && assistants.size() != updateDto.assistantIds().size()) {
            throw new IllegalArgumentException("One or more assistants not found");
        }
        
        return labCourseService.update(id, updateDto.toLabCourse(semester, subject, professors, assistants))
                .map(LabCourseDTO::from)
                .orElseThrow(() -> new IllegalArgumentException("LabCourse with id " + id + " not found"));
    }
    
    @Override
    public void deleteById(Long id) {
        labCourseService.deleteById(id);
    }
}
