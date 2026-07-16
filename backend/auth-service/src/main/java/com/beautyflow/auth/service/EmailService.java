package com.beautyflow.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String toEmail, String otp) {
        log.info("Preparing to send verification email to {}", toEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("BeautyFlow Account Verification Code");
            
            String htmlContent = "<html>" +
                    "<body style='font-family: Arial, sans-serif; background-color: #0f172a; color: #f1f5f9; padding: 20px;'>" +
                    "<div style='max-width: 500px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>" +
                    "<div style='text-align: center; margin-bottom: 24px;'>" +
                    "<h2 style='color: #f43f5e; margin: 0; font-weight: bold;'>BeautyFlow</h2>" +
                    "<p style='color: #94a3b8; font-size: 14px; margin: 4px 0 0 0;'>AI-Powered Beauty Booking SaaS</p>" +
                    "</div>" +
                    "<hr style='border-top: 1px solid #334155; margin-bottom: 24px;' />" +
                    "<p style='font-size: 16px; color: #e2e8f0; line-height: 1.5;'>Hi there,</p>" +
                    "<p style='font-size: 14px; color: #94a3b8; line-height: 1.5;'>Thank you for creating an account on BeautyFlow. Please use the following 6-digit verification code to activate your account. This code will expire in 10 minutes.</p>" +
                    "<div style='text-align: center; margin: 32px 0;'>" +
                    "<span style='display: inline-block; background-color: #0f172a; border: 1px solid #e11d48; color: #f43f5e; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 32px; border-radius: 8px;'>" + otp + "</span>" +
                    "</div>" +
                    "<p style='font-size: 12px; color: #64748b; line-height: 1.5;'>If you did not make this request, please ignore this email.</p>" +
                    "<hr style='border-top: 1px solid #334155; margin-top: 32px; margin-bottom: 16px;' />" +
                    "<div style='text-align: center; font-size: 12px; color: #64748b;'>" +
                    "© 2026 BeautyFlow SaaS. All rights reserved." +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Verification email successfully sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}. Error: {}", toEmail, e.getMessage());
            log.info("--- [FALLBACK: Verification OTP code is: {}] ---", otp);
        }
    }
}
