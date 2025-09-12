package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import mk.ukim.finki.labs.backend.repository.LabCourseRepository;
import mk.ukim.finki.labs.backend.service.domain.LabCourseService;
import mk.ukim.finki.labs.backend.model.exceptions.DuplicateLabCourseException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static mk.ukim.finki.labs.backend.service.specification.FieldFilterSpecification.filterEquals;
import static mk.ukim.finki.labs.backend.service.specification.FieldFilterSpecification.filterContainsText;

@AllArgsConstructor
@Service
@Transactional
public class LabCourseServiceImpl implements LabCourseService {
    
    private final LabCourseRepository labCourseRepository;
    
    @Override
    public Page<LabCourse> filter(String search, String semesterCode, Integer page, Integer pageSize) {
        
        Specification<LabCourse> subjectSearchSpec = Specification.anyOf(
            filterContainsText(LabCourse.class, "joinedSubject.abbreviation", search),
            filterContainsText(LabCourse.class, "joinedSubject.name", search),
            filterContainsText(LabCourse.class, "joinedSubject.mainSubject.id", search)
        );

        Specification<LabCourse> specification = Specification
                .allOf(
                        subjectSearchSpec,
                        filterEquals(LabCourse.class, "semester.code", semesterCode)
                );

        return this.labCourseRepository.findAll(
                specification,
                PageRequest.of(page, pageSize)
        );
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<LabCourse> findAll() {
        return labCourseRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<LabCourse> findById(Long id) {
        return labCourseRepository.findById(id);
    }
    
    @Override
    public Optional<LabCourse> save(LabCourse labCourse) {
        // Check if combination already exists
        if (labCourseRepository.existsBySemesterCodeAndJoinedSubjectAbbreviation(
                labCourse.getSemester().getCode(), 
                labCourse.getJoinedSubject().getAbbreviation())) {
            throw new DuplicateLabCourseException(
                labCourse.getSemester().getCode(), 
                labCourse.getJoinedSubject().getAbbreviation()
            );
        }
        
        var savedLabCourse = labCourseRepository.save(labCourse);
        return Optional.of(savedLabCourse);
    }
    
    @Override
    public Optional<LabCourse> update(Long id, LabCourse labCourse) {
        return labCourseRepository.findById(id)
                .map(existingLabCourse -> {
                    // Check if combination already exists (excluding current record)
                    var existingCourses = labCourseRepository.findBySemesterCodeAndSubjectAbbreviation(
                        labCourse.getSemester().getCode(), 
                        labCourse.getJoinedSubject().getAbbreviation()
                    );
                    var duplicateExists = existingCourses.stream()
                            .anyMatch(course -> !course.getId().equals(id));
                    
                    if (duplicateExists) {
                        throw new DuplicateLabCourseException(
                            labCourse.getSemester().getCode(), 
                            labCourse.getJoinedSubject().getAbbreviation()
                        );
                    }
                    
                    if (labCourse.getSemester() != null) {
                        existingLabCourse.setSemester(labCourse.getSemester());
                    }
                    
                    if (labCourse.getJoinedSubject() != null) {
                        existingLabCourse.setJoinedSubject(labCourse.getJoinedSubject());
                    }
                    
                    if (labCourse.getDescription() != null) {
                        existingLabCourse.setDescription(labCourse.getDescription());
                    }
                    
                    if (labCourse.getProfessors() != null) {
                        existingLabCourse.setProfessors(labCourse.getProfessors());
                    }
                    
                    if (labCourse.getAssistants() != null) {
                        existingLabCourse.setAssistants(labCourse.getAssistants());
                    }
                    
                    if (labCourse.getStatus() != null) {
                        existingLabCourse.setStatus(labCourse.getStatus());
                    }
                    
                    return labCourseRepository.save(existingLabCourse);
                });
    }
    
    @Override
    public void deleteById(Long id) {
        if (!labCourseRepository.existsById(id)) {
            throw new IllegalArgumentException("LabCourse with id " + id + " not found");
        }
        labCourseRepository.deleteById(id);
    }

}
