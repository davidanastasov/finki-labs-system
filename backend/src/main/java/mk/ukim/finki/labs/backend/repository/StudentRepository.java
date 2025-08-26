package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.Student;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaSpecificationRepository<Student, String> {

}
