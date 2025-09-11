package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.JoinedSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JoinedSubjectRepository extends JpaRepository<JoinedSubject, String> {
}
