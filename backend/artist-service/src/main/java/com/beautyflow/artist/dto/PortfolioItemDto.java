package com.beautyflow.artist.dto;

import com.beautyflow.artist.entity.PortfolioMediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioItemDto {
    private UUID id;
    private String title;
    private String description;
    private String mediaUrl;
    private PortfolioMediaType mediaType;
    private LocalDateTime createdAt;
}
