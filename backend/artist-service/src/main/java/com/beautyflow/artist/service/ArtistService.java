package com.beautyflow.artist.service;

import com.beautyflow.artist.dto.ArtistProfileDto;
import com.beautyflow.artist.dto.UpdateProfileRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ArtistService {
    ArtistProfileDto getProfile(String email, UUID userId, String firstName, String lastName);
    ArtistProfileDto updateProfile(UUID userId, UpdateProfileRequest request);
    ArtistProfileDto uploadPortfolioItem(UUID userId, String title, String description, MultipartFile file);
    ArtistProfileDto deletePortfolioItem(UUID userId, UUID itemId);
    ArtistProfileDto getPublicProfile(UUID profileId);
}
