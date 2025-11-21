package com.mine.shops.controller;

import com.mine.shops.dto.UserDto;
import com.mine.shops.exceptions.AlreadyExistsException;
import com.mine.shops.exceptions.ResourceNotFoundException;
import com.mine.shops.model.Role;
import com.mine.shops.model.ShopUser;
import com.mine.shops.repository.RoleRepository;
import com.mine.shops.request.CreateUserRequest;
import com.mine.shops.request.UpdateUserRequest;
import com.mine.shops.response.ApiResponse;
import com.mine.shops.service.cart.CartService;
import com.mine.shops.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final UserService userService;
    private final CartService cartService;
    private final RoleRepository roleRepository;


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            List<UserDto> users = userService.getAllUsers();
            return ResponseEntity.ok(new ApiResponse("Success", users));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse( e.getMessage(), null));
        }
    }

    @GetMapping("/{userId}/user")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
        try {
            ShopUser user = userService.getUserById(userId);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Success", userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/user")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest request) {
        try {
            Role userRole = roleRepository.findByName("ROLE_USER");
            ShopUser user = userService.createUser(request, userRole);
            cartService.initCartIfNotExists(user.getId());
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Success", userDto));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse> createAdmin(@RequestBody CreateUserRequest request) {
        try {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN");
            ShopUser user = userService.createUser(request, adminRole);
            cartService.initCartIfNotExists(user.getId());
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Success", userDto));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/{userId}/user")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
        try {
            ShopUser user = userService.updateUser(request,userId);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Success", userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @PutMapping("/{userId}/user/{role}/role")
    public ResponseEntity<ApiResponse> updateUserRole(@PathVariable Long userId, @PathVariable String role) {
        try {
            String roleUpper = role.toUpperCase();
            Role userRole = null;
            if ("ROLE_ADMIN".contains(roleUpper)) {
                userRole = roleRepository.findByName("ROLE_ADMIN");
            } else if (roleUpper.contains("USER")) {
                userRole = roleRepository.findByName("ROLE_USER");
            }
            ShopUser user = userService.updateUserRole(userId, userRole);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Success", userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{userId}/user")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse("Deleted", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
