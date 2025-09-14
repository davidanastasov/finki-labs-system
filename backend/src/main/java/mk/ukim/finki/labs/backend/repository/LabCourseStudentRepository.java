package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.LabCourseStudent;
import mk.ukim.finki.labs.backend.model.domain.LabCourseStudentId;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabCourseStudentRepository extends JpaSpecificationRepository<LabCourseStudent, LabCourseStudentId> {
    List<LabCourseStudent> findAllByLabCourseId(Long courseId);
}
