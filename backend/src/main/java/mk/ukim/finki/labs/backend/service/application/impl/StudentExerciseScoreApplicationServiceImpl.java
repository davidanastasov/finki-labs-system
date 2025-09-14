package mk.ukim.finki.labs.backend.service.application.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.dto.scoring.BulkUpdateScoresDTO;
import mk.ukim.finki.labs.backend.dto.scoring.StudentExerciseScoreDTO;
import mk.ukim.finki.labs.backend.dto.scoring.UpdateStudentScoreDTO;
import mk.ukim.finki.labs.backend.model.domain.StudentExerciseScore;
import mk.ukim.finki.labs.backend.service.application.StudentExerciseScoreApplicationService;
import mk.ukim.finki.labs.backend.service.domain.ExerciseService;
import mk.ukim.finki.labs.backend.service.domain.StudentExerciseScoreService;
import mk.ukim.finki.labs.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class StudentExerciseScoreApplicationServiceImpl implements StudentExerciseScoreApplicationService {
    
    private final StudentExerciseScoreService scoreService;
    private final ExerciseService exerciseService;
    private final StudentRepository studentRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<StudentExerciseScoreDTO> findScoresByExerciseId(Long exerciseId) {
        return scoreService.findByExerciseId(exerciseId)
                .stream()
                .map(StudentExerciseScoreDTO::from)
                .toList();
    }
    
    @Override
    public StudentExerciseScoreDTO updateStudentScore(Long exerciseId, UpdateStudentScoreDTO updateDto) {
        var exercise = exerciseService.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise with id " + exerciseId + " not found"));
        
        var student = studentRepository.findById(updateDto.studentIndex())
                .orElseThrow(() -> new IllegalArgumentException("Student with index " + updateDto.studentIndex() + " not found"));
        
        // Validate points are within exercise limits
        if (updateDto.corePoints() > exercise.getTotalPoints()) {
            throw new IllegalArgumentException("Points cannot exceed exercise total points (" + exercise.getTotalPoints() + ")");
        }
        
        // Check if score already exists
        var existingScore = scoreService.findByStudentIndexAndExerciseId(updateDto.studentIndex(), exerciseId);
        
        StudentExerciseScore score;
        if (existingScore.isPresent()) {
            // Update existing score
            score = existingScore.get();
            score.setCorePoints(updateDto.corePoints());
            score.setDateGraded(LocalDateTime.now());
        } else {
            // Create new score
            score = new StudentExerciseScore(
                student,
                exercise,
                updateDto.corePoints(),
                LocalDateTime.now()
            );
        }
        
        var savedScore = scoreService.save(score)
                .orElseThrow(() -> new RuntimeException("Failed to save student score"));
        
        return StudentExerciseScoreDTO.from(savedScore);
    }
    
    @Override
    public List<StudentExerciseScoreDTO> bulkUpdateScores(Long exerciseId, BulkUpdateScoresDTO bulkUpdateDto) {
        // Verify exercise exists upfront to fail fast
        exerciseService.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise with id " + exerciseId + " not found"));
        
        List<StudentExerciseScoreDTO> results = new ArrayList<>();
        
        for (UpdateStudentScoreDTO scoreUpdate : bulkUpdateDto.scores()) {
            try {
                var result = updateStudentScore(exerciseId, scoreUpdate);
                results.add(result);
            } catch (Exception e) {
                // In a real application, you might want to collect errors and return them
                // For now, we'll continue processing other scores
                throw new RuntimeException("Failed to update score for student " + scoreUpdate.studentIndex() + ": " + e.getMessage());
            }
        }
        
        return results;
    }
    
    @Override
    public void deleteStudentScore(Long exerciseId, String studentIndex) {
        // Verify exercise exists
        exerciseService.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise with id " + exerciseId + " not found"));
        
        // Verify student exists
        studentRepository.findById(studentIndex)
                .orElseThrow(() -> new IllegalArgumentException("Student with index " + studentIndex + " not found"));
        
        scoreService.deleteByStudentIndexAndExerciseId(studentIndex, exerciseId);
    }
}
