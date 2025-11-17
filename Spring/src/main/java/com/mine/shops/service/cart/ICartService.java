package com.mine.shops.service.cart;

import com.mine.shops.dto.CartDto;
import com.mine.shops.model.Cart;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long id);
    void clearCart(Long id);
    BigDecimal getTotalPrice(Long id);

    Cart initCartIfNotExists(Long userId);

    Cart getCartByUserId(Long userId);

    CartDto convertCartToDto(Cart cart);
}
