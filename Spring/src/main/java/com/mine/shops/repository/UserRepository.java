package com.mine.shops.repository;

import com.mine.shops.model.ShopUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<ShopUser, Long> {
    boolean existsByEmail(String email);


    ShopUser findByEmail(String email);
}
