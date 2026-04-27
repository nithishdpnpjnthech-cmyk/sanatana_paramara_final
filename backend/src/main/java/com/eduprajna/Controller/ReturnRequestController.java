package com.eduprajna.controller;

import com.eduprajna.dto.ReturnRequestDTO;
import com.eduprajna.entity.Order;
import com.eduprajna.entity.OrderItem;
import com.eduprajna.entity.ReturnRequest;
import com.eduprajna.entity.ShippingSnapshot;
import com.eduprajna.entity.User;
import com.eduprajna.repository.OrderItemRepository;
import com.eduprajna.repository.OrderRepository;
import com.eduprajna.repository.ReturnRequestRepository;
import com.eduprajna.service.StorageService;
import com.eduprajna.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/returns")
public class ReturnRequestController {
    private static final Logger logger = LoggerFactory.getLogger(ReturnRequestController.class);

    @Autowired
    private ReturnRequestRepository returnRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private StorageService storageService;

    @PostMapping
    public ResponseEntity<?> submitReturn(
            @RequestParam("orderId") Long orderId,
            @RequestParam("email") String email,
            @RequestParam("reason") String reason,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            logger.info("Submitting return request for order: {} by user: {}", orderId, email);

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!"delivered".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only delivered orders can be returned"));
            }

            ReturnRequest request = new ReturnRequest();
            request.setOrder(order);
            request.setUser(user);
            request.setReason(reason);
            request.setStatus("PENDING");

            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = storageService.store(imageFile);
                request.setImageUrl(imageUrl);
            }

            ReturnRequest saved = returnRepo.save(request);

            // Update order with return status
            order.setReturnStatus("PENDING");
            orderRepo.save(order);

            return ResponseEntity.ok(new ReturnRequestDTO(saved));
        } catch (Exception e) {
            logger.error("Error submitting return request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit return request: " + e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserReturns(@RequestParam("email") String email) {
        try {
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<ReturnRequest> returns = returnRepo.findByUserOrderByCreatedAtDesc(user);
            List<ReturnRequestDTO> dtos = returns.stream().map(ReturnRequestDTO::new).collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch user returns"));
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAllReturns() {
        try {
            List<ReturnRequest> returns = returnRepo.findByOrderByCreatedAtDesc();
            List<ReturnRequestDTO> dtos = returns.stream().map(ReturnRequestDTO::new).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch all returns"));
        }
    }

    @PutMapping("/admin/{id}/status")
    @Transactional
    public ResponseEntity<?> updateReturnStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null)
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));

            ReturnRequest request = returnRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Return request not found"));

            request.setStatus(status.toUpperCase());
            ReturnRequest updated = returnRepo.save(request);

            // Also update the associated order's return status
            Order order = request.getOrder();
            if (order != null) {
                order.setReturnStatus(status.toUpperCase());
                orderRepo.save(order);

                // Automaticaly make it as re-order if status is APPROVED
                if ("APPROVED".equalsIgnoreCase(status)) {
                    createReorder(order);
                }
            }

            return ResponseEntity.ok(new ReturnRequestDTO(updated));
        } catch (Exception e) {
            logger.error("Error updating return status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update return status: " + e.getMessage()));
        }
    }

    @Transactional
    private void createReorder(Order originalOrder) {
        try {
            Order newOrder = new Order();
            newOrder.setUser(originalOrder.getUser());

            // Copy shipping details
            if (originalOrder.getShipping() != null) {
                ShippingSnapshot oldShipping = originalOrder.getShipping();
                ShippingSnapshot newShipping = new ShippingSnapshot();
                newShipping.setName(oldShipping.getName());
                newShipping.setPhone(oldShipping.getPhone());
                newShipping.setStreet(oldShipping.getStreet());
                newShipping.setCity(oldShipping.getCity());
                newShipping.setState(oldShipping.getState());
                newShipping.setPincode(oldShipping.getPincode());
                newShipping.setLandmark(oldShipping.getLandmark());
                newShipping.setAddressType(oldShipping.getAddressType());
                newOrder.setShipping(newShipping);
            }

            newOrder.setDeliveryOption(originalOrder.getDeliveryOption());
            newOrder.setPaymentMethod("replacement");
            newOrder.setPaymentStatus("PAID"); // Replacement doesn't need new payment
            newOrder.setSubtotal(originalOrder.getSubtotal());
            newOrder.setShippingFee(originalOrder.getShippingFee());
            newOrder.setTotal(originalOrder.getTotal());
            newOrder.setStatus("pending");

            // Save order first to get ID for items
            final Order savedOrder = orderRepo.save(newOrder);

            // Copy items and save them explicitly
            originalOrder.getItems().forEach(item -> {
                OrderItem newItem = new OrderItem();
                newItem.setOrder(savedOrder);
                newItem.setProduct(item.getProduct());
                newItem.setVariant(item.getVariant());
                newItem.setProductName(item.getProductName());
                newItem.setProductImageUrl(item.getProductImageUrl());
                newItem.setVariantName(item.getVariantName());
                newItem.setVariantPrice(item.getVariantPrice());
                newItem.setVariantOriginalPrice(item.getVariantOriginalPrice());
                newItem.setVariantWeightValue(item.getVariantWeightValue());
                newItem.setVariantWeightUnit(item.getVariantWeightUnit());
                newItem.setQuantity(item.getQuantity());
                newItem.setPrice(item.getPrice());
                newItem.setWeightValue(item.getWeightValue());
                newItem.setWeightUnit(item.getWeightUnit());
                orderItemRepo.save(newItem);
                savedOrder.getItems().add(newItem);
            });

            // Final save to update the order with the collection of items (redundant but
            // safe)
            orderRepo.save(savedOrder);

            logger.info("Created re-order #{} from original order #{} with {} items",
                    savedOrder.getId(), originalOrder.getId(), savedOrder.getItems().size());
        } catch (Exception e) {
            logger.error("Failed to create automatic re-order", e);
        }
    }
}
