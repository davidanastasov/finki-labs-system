package mk.ukim.finki.labs.backend.service.domain.impl;

import mk.ukim.finki.labs.backend.dto.exercise.file.FileDownloadResult;
import mk.ukim.finki.labs.backend.model.domain.Exercise;
import mk.ukim.finki.labs.backend.model.domain.ExerciseFile;
import mk.ukim.finki.labs.backend.repository.ExerciseFileRepository;
import mk.ukim.finki.labs.backend.service.domain.ExerciseFileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class ExerciseFileServiceImpl implements ExerciseFileService {

    private final ExerciseFileRepository exerciseFileRepository;
    private final String uploadDirectory;
    
    // Allowed file types
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/zip",
        "application/x-zip-compressed",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/java-archive",
        "text/x-java-source",
        "application/x-java-source"
    );
    
    // Maximum file size: 10MB
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    
    public ExerciseFileServiceImpl(ExerciseFileRepository exerciseFileRepository,
                                   @Value("${app.upload.directory:backend/data/exercises}") String uploadDirectory) {
        this.exerciseFileRepository = exerciseFileRepository;
        this.uploadDirectory = uploadDirectory;
        createUploadDirectoryIfNotExists();
    }
    
    private void createUploadDirectoryIfNotExists() {
        try {
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    @Override
    public ExerciseFile findById(String id) {
        return exerciseFileRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new IllegalArgumentException("File not found: " + id));
    }

    @Override
    public List<ExerciseFile> saveFiles(List<MultipartFile> files, Exercise exercise) {
        List<ExerciseFile> savedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            // Validate file
            if (!isValidFileType(file.getContentType())) {
                throw new IllegalArgumentException("File type not allowed: " + file.getContentType());
            }

            if (!isValidFileSize(file.getSize())) {
                throw new IllegalArgumentException("File size exceeds maximum allowed size");
            }

            try {
                // Generate unique filename
                String fileName = file.getOriginalFilename();
                String fileExtension = "";
                if (fileName != null && fileName.contains(".")) {
                    fileExtension = fileName.substring(fileName.lastIndexOf("."));
                }

                String uniqueFileName = UUID.randomUUID() + fileExtension;

                // Create exercise-specific directory
                Path exerciseDir = Paths.get(uploadDirectory, "exercise_" + exercise.getId());
                if (!Files.exists(exerciseDir)) {
                    Files.createDirectories(exerciseDir);
                }

                // Save file to disk
                Path filePath = exerciseDir.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Create and save ExerciseFile entity
                ExerciseFile exerciseFile = new ExerciseFile(
                    fileName,
                    filePath.toString(),
                    file.getSize(),
                    file.getContentType(),
                    exercise
                );

                ExerciseFile savedFile = exerciseFileRepository.save(exerciseFile);
                savedFiles.add(savedFile);

            } catch (IOException e) {
                throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
            }
        }

        return savedFiles;
    }

    @Override
    public byte[] downloadFile(String id) {
        try {
            ExerciseFile exerciseFile = findById(id);

            // Use the file path from the database
            Path filePath = Paths.get(exerciseFile.getFilePath());
            if (!Files.exists(filePath)) {
                throw new IllegalArgumentException("File not found on disk: " + exerciseFile.getFileName());
            }

            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file with ID: " + id, e);
        }
    }

    @Override
    public FileDownloadResult downloadFileWithMetadata(String id) {
        try {
            ExerciseFile exerciseFile = findById(id);

            // Use the file path from the database
            Path filePath = Paths.get(exerciseFile.getFilePath());
            if (!Files.exists(filePath)) {
                throw new IllegalArgumentException("File not found on disk: " + exerciseFile.getFileName());
            }

            byte[] fileData = Files.readAllBytes(filePath);
            return new FileDownloadResult(exerciseFile, fileData);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file with ID: " + id, e);
        }
    }

    @Override
    public void deleteFilesByExerciseId(Long exerciseId) {
        List<ExerciseFile> files = exerciseFileRepository.findByExerciseId(exerciseId);

        for (ExerciseFile file : files) {
            deleteFile(file);
        }

        exerciseFileRepository.deleteByExerciseId(exerciseId);
    }

    @Override
    public void deleteFile(ExerciseFile file) {
        try {
            Path filePath = Paths.get(file.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file with ID: " + file.getId(), e);
        }
    }

    @Override
    public boolean isValidFileType(String contentType) {
        return contentType != null && ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase());
    }
    
    @Override
    public boolean isValidFileSize(long size) {
        return size > 0 && size <= MAX_FILE_SIZE;
    }
}
