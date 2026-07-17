package com.beautyflow.artist.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
}
