package com.beautyflow.artist.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String bio;
    private String specialty;

    @Min(value = 0, message = "Starting price cannot be negative")
    private Double startingPrice;

    @Min(value = 0, message = "Experience years cannot be negative")
    private Integer experienceYears;

    private String avatarUrl;
}
