package com.beautyflow.artist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistProfileDto {
    private UUID id;
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String specialty;
    private Double startingPrice;
    private Double rating;
    private Integer experienceYears;
    private String avatarUrl;
    private List<PortfolioItemDto> portfolioItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
