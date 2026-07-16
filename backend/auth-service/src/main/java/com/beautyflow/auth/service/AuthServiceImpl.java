package com.beautyflow.auth.service;

import com.beautyflow.auth.dto.*;
import com.beautyflow.auth.entity.User;
import com.beautyflow.auth.entity.Wallet;
import com.beautyflow.auth.mapper.UserMapper;
import com.beautyflow.auth.repository.UserRepository;
import com.beautyflow.auth.repository.WalletRepository;
import com.beautyflow.shared.enums.Role;
import com.beautyflow.shared.enums.UserStatus;
import com.beautyflow.shared.exception.BadRequestException;
import com.beautyflow.shared.exception.ResourceNotFoundException;
import com.beautyflow.shared.exception.UnauthorizedException;
import com.beautyflow.shared.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .status(UserStatus.PENDING)
                .build();

        userRepository.save(user);

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        redisTemplate.opsForValue().set("otp:" + user.getEmail(), otp, Duration.ofMinutes(10));
        
        log.info("--- [BEAUTYFLOW Verification OTP for {}: {}] ---", user.getEmail(), otp);

        // For MVP, we return a response. In production, we'd send an email/SMS.
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .user(UserMapper.toDto(user))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            throw new BadRequestException("Email not verified. Please verify your email first.");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended. Please contact administration.");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .user(UserMapper.toDto(user))
                .build();
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String email = jwtUtils.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended.");
        }

        String newToken = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(newToken)
                .refreshToken(newRefreshToken)
                .user(UserMapper.toDto(user))
                .build();
    }

    @Override
    @Transactional
    public boolean verifyOtp(VerifyOtpRequest request) {
        String savedOtp = redisTemplate.opsForValue().get("otp:" + request.getEmail());
        if (savedOtp == null || !savedOtp.equals(request.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() == UserStatus.PENDING) {
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);

            // Create Wallet upon account activation
            Wallet wallet = Wallet.builder()
                    .user(user)
                    .balance(BigDecimal.ZERO)
                    .currency("INR")
                    .build();
            walletRepository.save(wallet);

            redisTemplate.delete("otp:" + request.getEmail());
            return true;
        }

        return false;
    }

    @Override
    public UserDto getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.toDto(user);
    }
}
