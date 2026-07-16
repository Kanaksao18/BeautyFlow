package com.beautyflow.auth.service;

import com.beautyflow.auth.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(String refreshToken);
    boolean verifyOtp(VerifyOtpRequest request);
    UserDto getMe(String email);
    AuthResponse loginGoogle(GoogleLoginRequest request);
}
