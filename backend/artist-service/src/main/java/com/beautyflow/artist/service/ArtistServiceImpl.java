package com.beautyflow.artist.service;

import com.beautyflow.artist.dto.ArtistProfileDto;
import com.beautyflow.artist.dto.UpdateProfileRequest;
import com.beautyflow.artist.entity.ArtistProfile;
import com.beautyflow.artist.entity.PortfolioItem;
import com.beautyflow.artist.entity.PortfolioMediaType;
import com.beautyflow.artist.mapper.ArtistMapper;
import com.beautyflow.artist.repository.ArtistProfileRepository;
import com.beautyflow.artist.repository.PortfolioItemRepository;
import com.beautyflow.shared.exception.BadRequestException;
import com.beautyflow.shared.exception.ResourceNotFoundException;
import com.beautyflow.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArtistServiceImpl implements ArtistService {

    private final ArtistProfileRepository profileRepository;
    private final PortfolioItemRepository portfolioRepository;
    private final StorageService storageService;

    @Override
    @Transactional
    public ArtistProfileDto getProfile(String email, UUID userId, String firstName, String lastName) {
        ArtistProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    log.info("Bootstrapping new Artist Profile for user {}", email);
                    ArtistProfile newProfile = ArtistProfile.builder()
                            .userId(userId)
                            .email(email)
                            .firstName(firstName)
                            .lastName(lastName)
                            .build();
                    return profileRepository.save(newProfile);
                });
        return ArtistMapper.toDto(profile);
    }

    @Override
    @Transactional
    public ArtistProfileDto updateProfile(UUID userId, UpdateProfileRequest request) {
        ArtistProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist Profile not found"));

        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getSpecialty() != null) profile.setSpecialty(request.getSpecialty());
        if (request.getStartingPrice() != null) profile.setStartingPrice(request.getStartingPrice());
        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());

        ArtistProfile saved = profileRepository.save(profile);
        return ArtistMapper.toDto(saved);
    }

    @Override
    @Transactional
    public ArtistProfileDto uploadPortfolioItem(UUID userId, String title, String description, MultipartFile file) {
        ArtistProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist Profile not found"));

        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        String contentType = file.getContentType();
        PortfolioMediaType mediaType = PortfolioMediaType.IMAGE;
        if (contentType != null && contentType.startsWith("video")) {
            mediaType = PortfolioMediaType.VIDEO;
        }

        String mediaUrl = storageService.storeFile(file, "portfolio");

        PortfolioItem item = PortfolioItem.builder()
                .artistProfile(profile)
                .title(title != null ? title : "Untitled Creation")
                .description(description)
                .mediaUrl(mediaUrl)
                .mediaType(mediaType)
                .build();
        portfolioRepository.save(item);

        profile.getPortfolioItems().add(item);
        profileRepository.save(profile);

        log.info("Uploaded portfolio item {} for artist profile {}", item.getId(), profile.getId());
        return ArtistMapper.toDto(profile);
    }

    @Override
    @Transactional
    public ArtistProfileDto deletePortfolioItem(UUID userId, UUID itemId) {
        ArtistProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist Profile not found"));

        PortfolioItem item = portfolioRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio item not found"));

        if (!item.getArtistProfile().getId().equals(profile.getId())) {
            throw new UnauthorizedException("You do not own this portfolio item");
        }

        storageService.deleteFile(item.getMediaUrl());

        profile.getPortfolioItems().remove(item);
        portfolioRepository.delete(item);
        profileRepository.save(profile);

        log.info("Deleted portfolio item {} for artist profile {}", itemId, profile.getId());
        return ArtistMapper.toDto(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public ArtistProfileDto getPublicProfile(UUID profileId) {
        ArtistProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist Profile not found"));
        return ArtistMapper.toDto(profile);
    }
}
