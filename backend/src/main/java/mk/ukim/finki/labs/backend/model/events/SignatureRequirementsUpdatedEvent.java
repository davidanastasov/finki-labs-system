package mk.ukim.finki.labs.backend.model.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;

/**
 * Event triggered when signature requirements for a course are updated.
 * This requires recalculation of signature status for all students in the course.
 */
@Getter
public class SignatureRequirementsUpdatedEvent extends ApplicationEvent {
    private final Long courseId;
    private final LocalDateTime when;

    public SignatureRequirementsUpdatedEvent(Object source, Long courseId) {
        super(source);
        this.courseId = courseId;
        this.when = LocalDateTime.now();
    }
}
