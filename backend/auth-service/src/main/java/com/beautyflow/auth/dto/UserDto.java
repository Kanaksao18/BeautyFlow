package com.beautyflow.auth.dto;

import com.beautyflow.shared.enums.Role;
import com.beautyflow.shared.enums.UserStatus;
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
public class UserDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Role role;
    private UserStatus status;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
