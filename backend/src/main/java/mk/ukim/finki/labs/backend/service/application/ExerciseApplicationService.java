package mk.ukim.finki.labs.backend.service.application;

import mk.ukim.finki.labs.backend.dto.exercise.CreateExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDTO;
import mk.ukim.finki.labs.backend.dto.exercise.ExerciseDetailsDTO;
import mk.ukim.finki.labs.backend.dto.exercise.UpdateExerciseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ExerciseApplicationService {
    
    List<ExerciseDTO> findByLabCourseId(Long labCourseId);
    
    ExerciseDetailsDTO findById(Long id);

    ExerciseDetailsDTO createWithFiles(CreateExerciseDTO createDto, List<MultipartFile> files);

    ExerciseDetailsDTO updateWithFiles(Long id, UpdateExerciseDTO updateDto, List<MultipartFile> files, List<String> removeFiles);
    
    void deleteById(Long id);
}
