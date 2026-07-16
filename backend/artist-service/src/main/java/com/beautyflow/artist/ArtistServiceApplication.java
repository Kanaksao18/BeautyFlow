package com.beautyflow.artist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.beautyflow.artist", "com.beautyflow.shared"})
public class ArtistServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ArtistServiceApplication.class, args);
    }
}
