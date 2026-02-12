package mk.ukim.finki.labs.backend.listeners;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.labs.backend.model.events.SignatureRequirementsUpdatedEvent;
import mk.ukim.finki.labs.backend.model.events.SignatureStatusUpdateEvent;
import mk.ukim.finki.labs.backend.service.domain.LabCourseService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class SignatureStatusEventHandlers {

    private final LabCourseService labCourseService;

    /**
     * Handles signature status update for one or more students.
     * Works for both single and bulk score updates.
     */
    @EventListener
    @Transactional
    public void onSignatureStatusUpdate(SignatureStatusUpdateEvent event) {
        labCourseService.recalculateSignatureStatusesForStudents(
            event.getCourseId(),
            event.getStudentIndexes()
        );
    }

    /**
     * Handles bulk signature status update for all students in a course.
     * Triggered when signature requirements change.
     */
    @EventListener
    @Transactional
    public void onSignatureRequirementsUpdated(SignatureRequirementsUpdatedEvent event) {
        labCourseService.recalculateSignatureStatusesForCourse(event.getCourseId());
    }
    
}
