package com.mine.shops.service.order;

import com.mine.shops.dto.OrderDto;
import com.mine.shops.model.Order;

import java.util.List;

public interface IOrderService {
    Order placeOrder(Long userId);

    List<OrderDto> getAllOrders();

    OrderDto getOrder(Long orderId);

    List<OrderDto> getUserOrders(Long userId);

    void deleteOrder(Long orderId);

    OrderDto convertToDto(Order order);
}
