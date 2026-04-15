package com.example.demo.service;

import com.example.demo.dto.DetectionDTO;
import com.example.demo.dto.DetectionResponseDTO;
import com.example.demo.model.detectionModel;
import com.example.demo.model.fieldModel;
import com.example.demo.model.PlanteModel;
import com.example.demo.repository.DetectionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DetectionService {

    private final DetectionRepository detectionRepository;
    private final RestTemplate restTemplate;

    public DetectionService(DetectionRepository detectionRepository, RestTemplate restTemplate) {
        this.detectionRepository = detectionRepository;
        this.restTemplate = restTemplate;
    }

    @Value("${cnn.service.url}")
    private String cnnServiceUrl;

    @Value("${upload.dir}")
    private String uploadDir;

    public DetectionDTO detect(MultipartFile file, Long terrainId, Long planteId) throws IOException {
        // 1. Save image to disk
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        System.out.println("Image saved to: " + filePath.toString());

        // 2. Call FastAPI /predict
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(filePath.toFile()));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        System.out.println("Calling FastAPI at: " + cnnServiceUrl + "/predict");
        
        DetectionResponseDTO prediction;
        try {
            ResponseEntity<DetectionResponseDTO> response = restTemplate.exchange(
                cnnServiceUrl + "/predict",
                HttpMethod.POST,
                requestEntity,
                DetectionResponseDTO.class
            );

            prediction = response.getBody();
            System.out.println("FastAPI response: " + prediction);
        } catch (Exception e) {
            System.out.println("Error calling FastAPI: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

        // 3. Build and persist Detection entity
        detectionModel detection = new detectionModel();
        detection.setImagePath(uploadDir + "/" + filename);
        detection.setPredictedClass(prediction.getDisease());
        detection.setConfidence(prediction.getConfidence());
        detection.setIsHealthy(prediction.isHealthy());
        detection.setDetectedAt(LocalDateTime.now());
        detection.setModelVersion("efficientnet-b0-v1");

        if (terrainId != null) {
            fieldModel terrain = new fieldModel();
            terrain.setId(terrainId);
            detection.setTerrain(terrain);
        }
        if (planteId != null) {
            PlanteModel plante = new PlanteModel();
            plante.setId(planteId);
            detection.setPlante(plante);
        }

        detectionModel saved = detectionRepository.save(detection);

        // 4. Map to DTO
        DetectionDTO dto = new DetectionDTO();
        dto.setId(saved.getId());
        dto.setImagePath(saved.getImagePath());
        dto.setPredictedClass(saved.getPredictedClass());
        dto.setConfidence(saved.getConfidence());
        dto.setIsHealthy(saved.getIsHealthy());
        dto.setDetectedAt(saved.getDetectedAt());
        dto.setModelVersion(saved.getModelVersion());

        return dto;
    }

    public List<DetectionDTO> getAll() {
        return detectionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DetectionDTO> getByTerrainId(Long terrainId) {
        return detectionRepository.findByTerrainId(terrainId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private DetectionDTO mapToDTO(detectionModel detection) {
        DetectionDTO dto = new DetectionDTO();
        dto.setId(detection.getId());
        dto.setImagePath(detection.getImagePath());
        dto.setPredictedClass(detection.getPredictedClass());
        dto.setConfidence(detection.getConfidence());
        dto.setIsHealthy(detection.getIsHealthy());
        dto.setDetectedAt(detection.getDetectedAt());
        dto.setModelVersion(detection.getModelVersion());
        return dto;
    }
}
