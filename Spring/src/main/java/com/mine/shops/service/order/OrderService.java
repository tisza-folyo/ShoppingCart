package com.mine.shops.service.order;

import com.mine.shops.dto.OrderDto;
import com.mine.shops.enums.OrderStatus;
import com.mine.shops.exceptions.ResourceNotFoundException;
import com.mine.shops.model.Cart;
import com.mine.shops.model.Order;
import com.mine.shops.model.OrderItem;
import com.mine.shops.model.Product;
import com.mine.shops.repository.OrderRepository;
import com.mine.shops.repository.ProductRepository;
import com.mine.shops.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ICartService cartService;
    private final ModelMapper modelMapper;

    @Override
    public Order placeOrder(Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        Order order = createOrder(cart);
        List<OrderItem> orderItemList = createOrderItems(order, cart);
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setTotalAmount(calculateTotalAmount(orderItemList));
        Order savedOrder = orderRepository.save(order);

        cartService.clearCart(cart.getId());
        return savedOrder;
    }

    @Override
    public List<OrderDto> getAllOrders() { return orderRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList()); }

    @Override
    public OrderDto getOrder(Long orderId) {
        return orderRepository.findById(orderId).map(this::convertToDto).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByShopUserId(userId).stream().map(this::convertToDto).toList();
    }

    @Override
    public void deleteOrder(Long orderId){
        orderRepository.findById(orderId).ifPresentOrElse(orderRepository::delete, () -> {
            throw new ResourceNotFoundException("Order not found");
        });
    }

    private Order createOrder(Cart cart) {
        Order order = new Order();
        order.setShopUser(cart.getShopUser());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return order;
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream().map(cartItem ->{
           Product product = cartItem.getProduct();
           product.setInventory(product.getInventory() - cartItem.getQuantity());
           productRepository.save(product);
           return new OrderItem(
                   order,
                   product,
                   cartItem.getQuantity(),
                   cartItem.getUnitPrice()
           );
        }).toList();
    }

    private BigDecimal calculateTotalAmount(List<OrderItem> orderItems) {
        return orderItems.stream().map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);

    }
    @Override
    public OrderDto convertToDto(Order order) {
        return modelMapper.map(order, OrderDto.class);
    }

}
