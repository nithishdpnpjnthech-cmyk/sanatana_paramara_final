package com.eduprajna.dto;

import com.eduprajna.entity.ReturnRequest;
import java.time.OffsetDateTime;

public class ReturnRequestDTO {
    private Long id;
    private Long orderId;
    private Long userId;
    private String userEmail;
    private String reason;
    private String imageUrl;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public ReturnRequestDTO() {
    }

    public ReturnRequestDTO(ReturnRequest request) {
        this.id = request.getId();
        this.orderId = request.getOrder() != null ? request.getOrder().getId() : null;
        this.userId = request.getUser() != null ? request.getUser().getId() : null;
        this.userEmail = request.getUser() != null ? request.getUser().getEmail() : null;
        this.reason = request.getReason();
        this.imageUrl = request.getImageUrl();
        this.status = request.getStatus();
        this.createdAt = request.getCreatedAt();
        this.updatedAt = request.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
