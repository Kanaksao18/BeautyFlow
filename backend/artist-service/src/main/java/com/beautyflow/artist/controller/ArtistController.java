package com.beautyflow.artist.controller;

import com.beautyflow.artist.dto.ArtistProfileDto;
import com.beautyflow.artist.dto.UpdateProfileRequest;
import com.beautyflow.artist.dto.UserDto;
import com.beautyflow.artist.service.ArtistService;
import com.beautyflow.artist.service.LocalStorageServiceImpl;
import com.beautyflow.shared.dto.ApiResponse;
import com.beautyflow.shared.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/artists")
@RequiredArgsConstructor
@Slf4j
public class ArtistController {

    private final ArtistService artistService;
    private final LocalStorageServiceImpl localStorageService;
    private final RestTemplate restTemplate = new RestTemplate();

    private UserDto fetchUser(String bearerToken) {
        if (bearerToken == null || bearerToken.isEmpty()) {
            throw new UnauthorizedException("Missing Authorization header");
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", bearerToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = "http://localhost:8081/api/v1/users/me";
            ResponseEntity<ApiResponse<UserDto>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<ApiResponse<UserDto>>() {}
            );

            if (response.getBody() != null && response.getBody().getData() != null) {
                return response.getBody().getData();
            }
        } catch (Exception e) {
            log.error("Internal verification failed: {}", e.getMessage());
        }
        throw new UnauthorizedException("Internal authentication token verification failed");
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ArtistProfileDto>> getMyProfile(@RequestHeader("Authorization") String bearerToken) {
        UserDto user = fetchUser(bearerToken);
        ArtistProfileDto profile = artistService.getProfile(user.getEmail(), user.getId(), user.getFirstName(), user.getLastName());
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved successfully"));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ArtistProfileDto>> updateMyProfile(
            @RequestHeader("Authorization") String bearerToken,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto user = fetchUser(bearerToken);
        ArtistProfileDto profile = artistService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile updated successfully"));
    }

    @PostMapping("/portfolio/upload")
    public ResponseEntity<ApiResponse<ArtistProfileDto>> uploadPortfolio(
            @RequestHeader("Authorization") String bearerToken,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("file") MultipartFile file) {
        UserDto user = fetchUser(bearerToken);
        ArtistProfileDto profile = artistService.uploadPortfolioItem(user.getId(), title, description, file);
        return ResponseEntity.ok(ApiResponse.success(profile, "Portfolio media uploaded successfully"));
    }

    @DeleteMapping("/portfolio/{itemId}")
    public ResponseEntity<ApiResponse<ArtistProfileDto>> deletePortfolio(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable("itemId") UUID itemId) {
        UserDto user = fetchUser(bearerToken);
        ArtistProfileDto profile = artistService.deletePortfolioItem(user.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Portfolio item deleted successfully"));
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<ApiResponse<ArtistProfileDto>> getPublicProfile(@PathVariable("profileId") UUID profileId) {
        ArtistProfileDto profile = artistService.getPublicProfile(profileId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Public profile retrieved successfully"));
    }

    @GetMapping("/media/**")
    public ResponseEntity<byte[]> getMedia(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String path = uri.split("/media/")[1];
        try {
            byte[] bytes = localStorageService.loadFile(path);
            String contentType = localStorageService.getContentType(path);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(bytes);
        } catch (IOException e) {
            log.warn("Media file not found at path: {}", path);
            return ResponseEntity.notFound().build();
        }
    }
}
