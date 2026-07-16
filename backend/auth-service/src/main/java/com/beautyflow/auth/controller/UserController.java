package com.beautyflow.auth.controller;

import com.beautyflow.auth.dto.UserDto;
import com.beautyflow.auth.service.AuthService;
import com.beautyflow.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMe(Authentication authentication) {
        String email = authentication.getName();
        UserDto userDto = authService.getMe(email);
        return ResponseEntity.ok(ApiResponse.success(userDto, "Fetched current user details"));
    }
}
