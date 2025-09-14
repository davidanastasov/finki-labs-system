package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.scoring.BulkUpdateScoresDTO;
import mk.ukim.finki.labs.backend.dto.scoring.StudentExerciseScoreDTO;
import mk.ukim.finki.labs.backend.dto.scoring.UpdateStudentScoreDTO;

import java.util.List;

public interface StudentExerciseScoreApplicationService {
    
    List<StudentExerciseScoreDTO> findScoresByExerciseId(Long exerciseId);
    
    StudentExerciseScoreDTO updateStudentScore(Long exerciseId, UpdateStudentScoreDTO updateDto);
    
    List<StudentExerciseScoreDTO> bulkUpdateScores(Long exerciseId, BulkUpdateScoresDTO bulkUpdateDto);
    
    void deleteStudentScore(Long exerciseId, String studentIndex);
}
