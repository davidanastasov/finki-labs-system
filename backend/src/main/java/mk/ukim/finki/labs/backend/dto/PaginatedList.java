package mk.ukim.finki.labs.backend.dto;

import java.util.List;

public record PaginatedList<T>(Long count, List<T> items) {
}
