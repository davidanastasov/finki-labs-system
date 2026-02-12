package mk.ukim.finki.labs.backend.model.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Event triggered when student signature statuses need to be recalculated.
 * Can handle single student or multiple students at once.
 */
@Getter
public class SignatureStatusUpdateEvent extends ApplicationEvent {
    private final Set<String> studentIndexes;
    private final Long courseId;
    private final LocalDateTime when;

    // Single student constructor
    public SignatureStatusUpdateEvent(Object source, String studentIndex, Long courseId) {
        super(source);
        this.studentIndexes = Set.of(studentIndex);
        this.courseId = courseId;
        this.when = LocalDateTime.now();
    }

    // Bulk students constructor
    public SignatureStatusUpdateEvent(Object source, Set<String> studentIndexes, Long courseId) {
        super(source);
        this.studentIndexes = studentIndexes;
        this.courseId = courseId;
        this.when = LocalDateTime.now();
    }
}
