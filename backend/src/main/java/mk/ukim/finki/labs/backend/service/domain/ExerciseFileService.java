package mk.ukim.finki.labs.backend.service.domain;

import mk.ukim.finki.labs.backend.dto.exercise.file.FileDownloadResult;
import mk.ukim.finki.labs.backend.model.domain.Exercise;
import mk.ukim.finki.labs.backend.model.domain.ExerciseFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ExerciseFileService {
    ExerciseFile findById(String id);
    List<ExerciseFile> saveFiles(List<MultipartFile> files, Exercise exercise);
    byte[] downloadFile(String id);
    FileDownloadResult downloadFileWithMetadata(String id);
    void deleteFilesByExerciseId(Long exerciseId);
    void deleteFile(ExerciseFile file);
    boolean isValidFileType(String contentType);
    boolean isValidFileSize(long size);
}
