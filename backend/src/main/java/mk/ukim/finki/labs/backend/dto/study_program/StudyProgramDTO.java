package mk.ukim.finki.labs.backend.dto.study_program;

import mk.ukim.finki.labs.backend.model.domain.StudyProgram;

public record StudyProgramDTO (
        String code,
        String name
){

    public static StudyProgramDTO from (StudyProgram studyProgram){
        return new StudyProgramDTO(
                studyProgram.getCode(),
                studyProgram.getName()
        );
    }

}
