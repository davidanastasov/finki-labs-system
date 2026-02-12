package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.LabCourseStudent;
import mk.ukim.finki.labs.backend.model.domain.LabCourseStudentId;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface LabCourseStudentRepository extends JpaSpecificationRepository<LabCourseStudent, LabCourseStudentId> {
    List<LabCourseStudent> findAllByLabCourseId(Long courseId);
    List<LabCourseStudent> findAllByLabCourseIdAndStudentIndexIn(Long labCourseId, Set<String> studentIndexes);
    Optional<LabCourseStudent> findByLabCourseIdAndStudentIndex(Long labCourseId, String studentIndex);
}
