package com.example.CRW.controller;

import com.example.CRW.dto.Response;
import com.example.CRW.entity.User;
import com.example.CRW.service.interfac.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    // Admin-only: get all users
    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")

    public ResponseEntity<Response> getAllUsers() {
        Response response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Public: get user by ID
    @GetMapping("/get-by-id/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN') or (hasAuthority('ROLE_USER') and #userId == principal.id)")
    public ResponseEntity<Response> getUserById(@PathVariable Long userId) {
        Response response = userService.getUsersById(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Admin-only: delete user
    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<Response> deleteUser(@PathVariable Long userId) {
        Response response = userService.deleteUser(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Any authenticated user: get logged-in profile info
    @GetMapping("/get-logged-in-profile-info")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> getLoggedInUserProfileInfo(
            @AuthenticationPrincipal UserDetails userDetails) {
        Response response = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> getMyBookingHistory() {
        // Get the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedInUser = (User) auth.getPrincipal(); // your User implements UserDetails

        // Fetch bookings only for this user
        Response response = userService.getUserBookingHistory(loggedInUser.getId());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
