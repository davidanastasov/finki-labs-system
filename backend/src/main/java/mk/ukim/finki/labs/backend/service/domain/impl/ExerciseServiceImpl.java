package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.events.SignatureRequirementsUpdatedEvent;
import mk.ukim.finki.labs.backend.model.domain.Exercise;
import mk.ukim.finki.labs.backend.repository.ExerciseRepository;
import mk.ukim.finki.labs.backend.service.domain.ExerciseService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
@Transactional
public class ExerciseServiceImpl implements ExerciseService {
    
    private final ExerciseRepository exerciseRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    @Override
    @Transactional(readOnly = true)
    public List<Exercise> findByLabCourseId(Long labCourseId) {
        return exerciseRepository.findByLabCourseId(labCourseId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Exercise> findById(Long id) {
        return exerciseRepository.findById(id);
    }
    
    @Override
    public Optional<Exercise> save(Exercise exercise) {
        var savedExercise = exerciseRepository.save(exercise);
        
        // Publish event to recalculate signature statuses when min points change
        eventPublisher.publishEvent(
            new SignatureRequirementsUpdatedEvent(
                this,
                savedExercise.getLabCourse().getId()
            )
        );
        
        return Optional.of(savedExercise);
    }
    
    @Override
    public void deleteById(Long id) {
        if (!exerciseRepository.existsById(id)) {
            throw new IllegalArgumentException("Exercise with id " + id + " not found");
        }
        exerciseRepository.deleteById(id);
    }
    @Override
    @Transactional(readOnly = true)
    public long countByLabCourseId(Long labCourseId) {
        return exerciseRepository.countByLabCourseId(labCourseId);
    }
}
