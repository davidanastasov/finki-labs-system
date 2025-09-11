package mk.ukim.finki.labs.backend.dto.semester;

import mk.ukim.finki.labs.backend.model.domain.Semester;
import mk.ukim.finki.labs.backend.model.domain.SemesterState;
import mk.ukim.finki.labs.backend.model.domain.SemesterType;

import java.time.LocalDate;
import java.util.Optional;

public record SemesterDTO(
        String code,
        String year,
        SemesterType semesterType,
        LocalDate startDate,
        LocalDate endDate,
        Boolean isActive
) {

    public static SemesterDTO from(Semester semester) {
        return new SemesterDTO(
                semester.getCode(),
                semester.getYear(),
                semester.getSemesterType(),
                semester.getStartDate(),
                semester.getEndDate(),
                Optional.ofNullable(semester.getState()).map(SemesterState::isActive).orElse(false)
        );
    }
}
