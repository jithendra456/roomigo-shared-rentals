package com.roomigo.controller;

import com.roomigo.entity.Notification;
import com.roomigo.entity.User;
import com.roomigo.service.AuthService;
import com.roomigo.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(user)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Boolean>> markAsRead(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, Boolean>> markAllAsRead() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
