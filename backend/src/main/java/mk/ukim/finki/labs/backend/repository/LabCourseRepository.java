package mk.ukim.finki.labs.backend.repository;

import mk.ukim.finki.labs.backend.model.domain.LabCourse;
import mk.ukim.finki.labs.backend.model.domain.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LabCourseRepository extends JpaRepository<LabCourse, Long> {
    
    List<LabCourse> findBySemester(Semester semester);
    
    @Query("SELECT lc FROM LabCourse lc WHERE lc.semester.code = :semesterCode")
    List<LabCourse> findBySemesterCode(@Param("semesterCode") String semesterCode);
    
    @Query("SELECT lc FROM LabCourse lc WHERE lc.joinedSubject.abbreviation = :subjectAbbreviation")
    List<LabCourse> findBySubjectAbbreviation(@Param("subjectAbbreviation") String subjectAbbreviation);
    
    @Query("SELECT lc FROM LabCourse lc WHERE lc.semester.code = :semesterCode AND lc.joinedSubject.abbreviation = :subjectAbbreviation")
    List<LabCourse> findBySemesterCodeAndSubjectAbbreviation(@Param("semesterCode") String semesterCode, @Param("subjectAbbreviation") String subjectAbbreviation);
    
    boolean existsBySemesterCodeAndJoinedSubjectAbbreviation(String semesterCode, String joinedSubjectAbbreviation);
}
