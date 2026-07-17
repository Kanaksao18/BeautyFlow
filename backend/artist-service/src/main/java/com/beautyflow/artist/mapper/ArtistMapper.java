package com.beautyflow.artist.mapper;

import com.beautyflow.artist.dto.ArtistProfileDto;
import com.beautyflow.artist.dto.PortfolioItemDto;
import com.beautyflow.artist.entity.ArtistProfile;
import com.beautyflow.artist.entity.PortfolioItem;

import java.util.Collections;
import java.util.stream.Collectors;

public class ArtistMapper {

    public static PortfolioItemDto toDto(PortfolioItem item) {
        if (item == null) return null;
        return PortfolioItemDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .mediaUrl(item.getMediaUrl())
                .mediaType(item.getMediaType())
                .createdAt(item.getCreatedAt())
                .build();
    }

    public static ArtistProfileDto toDto(ArtistProfile profile) {
        if (profile == null) return null;
        return ArtistProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .bio(profile.getBio())
                .specialty(profile.getSpecialty())
                .startingPrice(profile.getStartingPrice())
                .rating(profile.getRating())
                .experienceYears(profile.getExperienceYears())
                .avatarUrl(profile.getAvatarUrl())
                .portfolioItems(profile.getPortfolioItems() == null ? Collections.emptyList() :
                        profile.getPortfolioItems().stream().map(ArtistMapper::toDto).collect(Collectors.toList()))
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
