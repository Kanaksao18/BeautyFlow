package com.beautyflow.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsService {

    @Value("${beautyflow.twilio.account-sid:mock-twilio-sid}")
    private String accountSid;

    @Value("${beautyflow.twilio.auth-token:mock-twilio-token}")
    private String authToken;

    @Value("${beautyflow.twilio.from-number:+15005550006}")
    private String fromNumber;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void sendVerificationSms(String toPhone, String otp) {
        String messageBody = "Your BeautyFlow phone verification code is: " + otp + ". This code expires in 10 minutes.";
        log.info("Preparing to send verification SMS to {}", toPhone);

        // Check if using Mock Config for Dev
        if ("mock-twilio-sid".equals(accountSid) || "mock-twilio-token".equals(authToken)) {
            log.info("--- [DEV-MOCK: Twilio credentials not set] ---");
            log.info("--- [FALLBACK: Verification SMS OTP to {}: {}] ---", toPhone, otp);
            return;
        }

        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";

            // Basic Auth Header
            String auth = accountSid + ":" + authToken;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.US_ASCII));
            String authHeader = "Basic " + new String(encodedAuth);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", authHeader);

            // Form Fields
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("From", fromNumber);
            map.add("To", toPhone);
            map.add("Body", messageBody);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Verification SMS successfully sent to Twilio for {}", toPhone);
            } else {
                log.warn("Twilio API returned status code: {}. Response: {}", response.getStatusCode(), response.getBody());
                log.info("--- [FALLBACK: Verification SMS OTP to {}: {}] ---", toPhone, otp);
            }
        } catch (Exception e) {
            log.error("Failed to send verification SMS via Twilio to {}. Error: {}", toPhone, e.getMessage());
            log.info("--- [FALLBACK: Verification SMS OTP to {}: {}] ---", toPhone, otp);
        }
    }
}
