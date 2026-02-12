package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import mk.ukim.finki.labs.backend.model.domain.LabCourseStudent;
import mk.ukim.finki.labs.backend.model.domain.SignatureStatus;
import mk.ukim.finki.labs.backend.model.domain.Student;
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

    Page<LabCourseStudent> filterStudents(Long courseId, String search, String studyProgramCode, Integer page, Integer pageSize);

    void addStudentsToCourse(Long courseId, List<String> studentIds);

    void removeStudentFromCourse(Long courseId, String studentId);

    SignatureStatus calculateSignatureStatus(LabCourseStudent student);

    void updateSignatureStatusForCourse(Long courseId);

    List<LabCourseStudent> findAllStudentsByCourseId(Long courseId);

    void updateRequiredExercisesForSignature(Long courseId, int requiredExercises);

}
