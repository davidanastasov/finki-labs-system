package mk.ukim.finki.labs.backend.config.init;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.domain.Semester;
import mk.ukim.finki.labs.backend.model.domain.SemesterType;
import mk.ukim.finki.labs.backend.model.domain.Student;
import mk.ukim.finki.labs.backend.model.domain.StudyProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@AllArgsConstructor
public class DataInitializer {
    private final _StudentRepository studentRepository;
    private final _SemesterRepository semesterRepository;

    @PostConstruct
    public void init() {
        // Semesters
        Semester winterSemester = new Semester();
        winterSemester.setCode("2024-25-W");
        winterSemester.setSemesterType(SemesterType.WINTER);
        winterSemester.setYear("2024-25");
        winterSemester.setStartDate(LocalDate.of(2024, 10, 1));
        winterSemester.setEndDate(LocalDate.of(2025, 1, 15));

        Semester summerSemester = new Semester();
        summerSemester.setCode("2024-25-S");
        summerSemester.setSemesterType(SemesterType.SUMMER);
        summerSemester.setYear("2024-25");
        summerSemester.setStartDate(LocalDate.of(2025, 2, 15));
        summerSemester.setEndDate(LocalDate.of(2025, 6, 15));

        semesterRepository.saveAll(List.of(winterSemester, summerSemester));

        // Students
        if (studentRepository.count() == 0) {
            StudyProgram PIT = new StudyProgram("PIT23", null);
            StudyProgram KN = new StudyProgram("KN18", null);

            var students = List.of(
                    new Student("216076", "david.anastasov@students.finki.ukim.mk", "Давид", "Анастасов", "Дејан", KN),
                    new Student("223244", "aleks.t1@students.finki.ukim.mk", "Александра", "Трпчевска", "Слободанчо", PIT),
                    new Student("223234", "ema.ristovska@students.finki.ukim.mk", "Ема", "Ристовска", "Даниел", PIT)
            );

            studentRepository.saveAll(students);
        }
    }
}

interface _StudentRepository extends JpaRepository<Student, String> {
};

interface _SemesterRepository extends JpaRepository<Semester, String> {
};