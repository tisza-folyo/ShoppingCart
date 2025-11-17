package com.mine.shops.controller;

import com.mine.shops.dto.CartDto;
import com.mine.shops.exceptions.AlreadyExistsException;
import com.mine.shops.exceptions.ResourceNotFoundException;
import com.mine.shops.model.Cart;
import com.mine.shops.response.ApiResponse;
import com.mine.shops.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static org.springframework.http.HttpStatus.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/carts")
public class CartController {
    private final ICartService cartService;


    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse> getCart(@PathVariable Long cartId) {
        try {
            Cart cart = cartService.getCart(cartId);
            CartDto cartDto = cartService.convertCartToDto(cart);
            return ResponseEntity.ok(new ApiResponse("success", cartDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{cartId}/total")
    public ResponseEntity<ApiResponse> getTotalAmount(@PathVariable Long cartId) {
        try {
            BigDecimal totalPrice = cartService.getTotalPrice(cartId);
            return ResponseEntity.ok(new ApiResponse("Success", totalPrice));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{cartId}/cart")
    public ResponseEntity<ApiResponse> clearCart(@PathVariable Long cartId) {
        try {
            cartService.clearCart(cartId);
            return ResponseEntity.ok(new ApiResponse("Success", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/{userId}/cart")
    public ResponseEntity<ApiResponse> createCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.initCartIfNotExists(userId);
            CartDto cartDto = cartService.convertCartToDto(cart);
            return ResponseEntity.ok(new ApiResponse("Created", cartDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }catch (AlreadyExistsException a){
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(a.getMessage(), null));
        }
    }


}
