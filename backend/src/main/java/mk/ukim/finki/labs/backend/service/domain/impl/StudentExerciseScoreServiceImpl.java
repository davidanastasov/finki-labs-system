package mk.ukim.finki.labs.backend.service.domain.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.labs.backend.model.events.SignatureStatusUpdateEvent;
import mk.ukim.finki.labs.backend.model.domain.StudentExerciseScore;
import mk.ukim.finki.labs.backend.repository.StudentExerciseScoreRepository;
import mk.ukim.finki.labs.backend.service.domain.StudentExerciseScoreService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
@Transactional
public class StudentExerciseScoreServiceImpl implements StudentExerciseScoreService {

    private final StudentExerciseScoreRepository scoreRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public List<StudentExerciseScore> findByExerciseId(Long exerciseId) {
        return scoreRepository.findByExerciseId(exerciseId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<StudentExerciseScore> findByStudentIndexAndExerciseId(String studentIndex, Long exerciseId) {
        return scoreRepository.findByStudentIndexAndExerciseId(studentIndex, exerciseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentExerciseScore> findByCourseId(Long courseId) {
        return scoreRepository.findByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentExerciseScore> findByStudentIndexAndCourseId(String studentIndex, Long courseId) {
        return scoreRepository.findByStudentIndexAndCourseId(studentIndex, courseId);
    }

    @Override
    public Optional<StudentExerciseScore> save(StudentExerciseScore score) {
        var savedScore = scoreRepository.save(score);

        eventPublisher.publishEvent(
                new SignatureStatusUpdateEvent(
                        this,
                        savedScore.getStudent().getIndex(),
                        savedScore.getExercise().getLabCourse().getId()
                )
        );

        return Optional.of(savedScore);
    }

    @Override
    public void deleteByStudentIndexAndExerciseId(String studentIndex, Long exerciseId) {
        scoreRepository.findByStudentIndexAndExerciseId(studentIndex, exerciseId)
                .ifPresent(score -> {
                    scoreRepository.delete(score);

                    eventPublisher.publishEvent(
                            new SignatureStatusUpdateEvent(
                                    this,
                                    score.getStudent().getIndex(),
                                    score.getExercise().getLabCourse().getId()
                            )
                    );
                });
    }
}
