package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import mk.ukim.finki.labs.backend.model.domain.LabCourseStudent;
import mk.ukim.finki.labs.backend.model.domain.LabCourseStudentId;
import mk.ukim.finki.labs.backend.model.domain.Student;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabCourseStudentRepository extends JpaSpecificationRepository<LabCourseStudent, LabCourseStudentId> {
    List<LabCourseStudent> findAllByLabCourseId(Long courseId);
    Optional<LabCourseStudent> findByStudentAndLabCourse(Student student, LabCourse labCourse);
}
