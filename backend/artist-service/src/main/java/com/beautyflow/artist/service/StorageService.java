package com.beautyflow.artist.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String storeFile(MultipartFile file, String folder);
    void deleteFile(String fileUrl);
}
