package com.beautyflow.artist.service;

import com.beautyflow.shared.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class LocalStorageServiceImpl implements StorageService {

    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";

    public LocalStorageServiceImpl() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            log.info("Created local uploads directory: {} -> {}", uploadDir, created);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String cleanFilename = UUID.randomUUID().toString() + extension;
            
            Path folderPath = Paths.get(uploadDir + (folder.isEmpty() ? "" : File.separator + folder));
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            Path destinationFile = folderPath.resolve(cleanFilename).normalize().toAbsolutePath();
            
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
            log.info("Successfully saved file to {}", destinationFile);

            return "/api/v1/artists/media/" + (folder.isEmpty() ? "" : folder + "/") + cleanFilename;
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new BadRequestException("Could not store file: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            String pathPart = fileUrl.replace("/api/v1/artists/media/", "");
            Path filePath = Paths.get(uploadDir).resolve(pathPart).normalize().toAbsolutePath();
            boolean deleted = Files.deleteIfExists(filePath);
            log.info("Deleted file at path: {} -> {}", filePath, deleted);
        } catch (IOException e) {
            log.warn("Failed to delete file from local storage: {}", fileUrl, e);
        }
    }

    public byte[] loadFile(String filePathStr) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filePathStr).normalize().toAbsolutePath();
        return Files.readAllBytes(filePath);
    }

    public String getContentType(String filePathStr) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filePathStr).normalize().toAbsolutePath();
        String contentType = Files.probeContentType(filePath);
        return contentType != null ? contentType : "application/octet-stream";
    }
}
