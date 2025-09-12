package mk.ukim.finki.labs.backend.repository;

import lombok.NonNull;
import mk.ukim.finki.labs.backend.model.domain.Semester;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, String> {
    @Override
    @NonNull
    List<Semester> findAll(@NonNull Sort sort);
}
