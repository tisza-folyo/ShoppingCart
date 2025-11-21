package com.mine.shops.service.cart;

import com.mine.shops.dto.CartDto;
import com.mine.shops.exceptions.ResourceNotFoundException;
import com.mine.shops.model.Cart;
import com.mine.shops.model.ShopUser;
import com.mine.shops.repository.CartItemRepository;
import com.mine.shops.repository.CartRepository;
import com.mine.shops.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final IUserService userService;
    public final ModelMapper modelMapper;

    @Override
    public Cart getCart(Long id) {
        Cart cart = cartRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        BigDecimal total = cart.getTotalAmount();
        cart.setTotalAmount(total);
        return cartRepository.save(cart);
    }

    @Transactional
    @Override
    public void clearCart(Long id) {
        Cart cart = cartRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cartItemRepository.deleteAllByCartId(id);
        cart.getItems().clear();
        cart.updateTotalAmount();
        cartRepository.deleteById(id);
    }

    @Override
    public BigDecimal getTotalPrice(Long id) {
        Cart cart = getCart(id);
        return cart.getTotalAmount();
    }

    @Override
    public Cart initCartIfNotExists(Long userId) {
        Cart existingCart = getCartByUserId(userId);
        if (existingCart != null) {
            return existingCart;
        }
        ShopUser user = userService.getUserById(userId);
        Cart cart = new Cart();
        cart.setShopUser(user);
        user.setCart(cart);
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByShopUserId(userId);
    }

    @Override
    public CartDto convertCartToDto(Cart cart) {
        return modelMapper.map(cart, CartDto.class);
    }
}
