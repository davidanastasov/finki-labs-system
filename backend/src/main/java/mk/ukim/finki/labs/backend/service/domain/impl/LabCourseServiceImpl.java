package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.*;
import mk.ukim.finki.labs.backend.repository.LabCourseRepository;
import mk.ukim.finki.labs.backend.repository.LabCourseStudentRepository;
import mk.ukim.finki.labs.backend.repository.StudentExerciseScoreRepository;
import mk.ukim.finki.labs.backend.repository.StudentRepository;
import mk.ukim.finki.labs.backend.service.domain.LabCourseService;
import mk.ukim.finki.labs.backend.model.exceptions.DuplicateLabCourseException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
    private final StudentRepository studentRepository;
    private final LabCourseStudentRepository labCourseStudentRepository;
    private final StudentExerciseScoreRepository studentExerciseScoreRepository;
    
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

    @Override
    public Page<LabCourseStudent> filterStudents(Long courseId, String search, String studyProgramCode, Integer page, Integer pageSize) {

        Specification<LabCourseStudent> fullNameSpec = (root, query, cb) -> {
            if (search == null || search.isEmpty()) return null;

            String value = "%" + search.toLowerCase() + "%";
            return cb.like(cb.lower(cb.concat(cb.concat(root.get("student").get("name"), " "), root.get("student").get("lastName"))), value);
        };

        Specification<LabCourseStudent> specification = Specification
                .allOf(
                        filterEquals(LabCourseStudent.class,"labCourse.id", courseId),
                        Specification.anyOf(
                                fullNameSpec,
                                filterContainsText(LabCourseStudent.class, "student.index", search)
                        ),
                        filterEquals(LabCourseStudent.class, "student.studyProgram.code", studyProgramCode)
                );

        return this.labCourseStudentRepository.findAll(
                specification,
                PageRequest.of(page, pageSize)
        );
    }

    @Override
    public void addStudentsToCourse(Long courseId, List<String> studentIds) {
        LabCourse course = labCourseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("LabCourse with id " + courseId + " not found"));

        List<Student> students = studentRepository.findAllById(studentIds);

        List<LabCourseStudent> newRelations = students.stream()
                .map(student -> new LabCourseStudent(course, student))
                .toList();

        labCourseStudentRepository.saveAll(newRelations);
    }

    @Override
    public void removeStudentFromCourse(Long courseId, String studentId) {
        labCourseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("LabCourse with id " + courseId + " not found"));

        studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student with id " + studentId + " not found"));

        LabCourseStudentId id = new LabCourseStudentId(courseId, studentId);
        labCourseStudentRepository.deleteById(id);
    }

//    @Override
//    public SignatureStatus calculateSignatureStatus(LabCourseStudent student) {
//        LabCourse course = student.getLabCourse();
//
//        List<StudentExerciseScore> scores = studentExerciseScoreRepository
//                .findByStudentAndExerciseLabCourse(student.getStudent(), course);
//
//        long successful = scores.stream()
//                .filter(score -> score.getCorePoints() != null
//                && score.getCorePoints() >= score.getExercise().getMinPointsForSignature())
//                .count();
//
//        return successful >= course.getRequiredExercisesForSignature()
//                ? SignatureStatus.ELIGIBLE
//                : SignatureStatus.NOT_ELIGIBLE;
//    }

    @Override
    public SignatureStatus calculateSignatureStatus(LabCourseStudent student) {
        LabCourse course = student.getLabCourse();

        // Handle courses without signature conditions
        if (course.getRequiredExercisesForSignature() == null) {
            return SignatureStatus.ELIGIBLE;
        }

        List<StudentExerciseScore> scores = studentExerciseScoreRepository
                .findByStudentAndExerciseLabCourse(student.getStudent(), course);

        long successfulExercisesCount = scores.stream()
                .filter(score -> {
                    Integer corePoints = score.getCorePoints();
                    Integer minPoints = Optional.ofNullable(score.getExercise())
                            .map(Exercise::getMinPointsForSignature)
                            .orElse(0);
                    return corePoints != null && corePoints >= minPoints;
                })
                .count();

        return successfulExercisesCount >= course.getRequiredExercisesForSignature()
                ? SignatureStatus.ELIGIBLE
                : SignatureStatus.NOT_ELIGIBLE;
    }

    @Override
    public void updateSignatureStatusForCourse(Long courseId) {
        List<LabCourseStudent> students = labCourseStudentRepository.findAllByLabCourseId(courseId);

        for (LabCourseStudent student : students){
            SignatureStatus signatureStatus = calculateSignatureStatus(student);
            student.setSignatureStatus(signatureStatus);
        }

        labCourseStudentRepository.saveAll(students);
    }

    @Override
    public List<LabCourseStudent> findAllStudentsByCourseId(Long courseId) {
        return labCourseStudentRepository.findAllByLabCourseId(courseId);
    }

    @Override
    public void updateRequiredExercisesForSignature(Long courseId, int requiredExercises) {
        LabCourse course = labCourseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("LabCourse with id " + courseId + " not found"));

        int totalLabs = Optional.ofNullable(course.getExercises()).map(List::size).orElse(0);
        
        if (requiredExercises > totalLabs) {
            throw new IllegalArgumentException("Required exercises cannot exceed total labs");
        }

        course.setRequiredExercisesForSignature(requiredExercises);
        labCourseRepository.save(course);
    }
}
