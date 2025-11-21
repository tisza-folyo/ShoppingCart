package com.mine.shops.data;

import com.mine.shops.model.Role;
import com.mine.shops.model.ShopUser;
import com.mine.shops.repository.RoleRepository;
import com.mine.shops.repository.UserRepository;
import com.mine.shops.service.cart.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Transactional
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationEvent> {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartService cartService;

    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        Set<String> defaultRoles = Set.of("ROLE_ADMIN", "ROLE_USER");
        createDefaultRoleIfNotExists(defaultRoles);
        createDefaultUserIfNotExists();
        createDefaultAdminIfNotExists();
    }

    private void createDefaultUserIfNotExists() {
        Role userRole = roleRepository.findByName("ROLE_USER");
        for (int i = 1; i <= 5; i++) {
            String defaultEmail = "user" + i + "@gmail.com";
            if (userRepository.existsByEmail(defaultEmail)) {
                continue;
            }
            ShopUser user = new ShopUser();
            user.setFirstName("The User");
            user.setLastName("User" + i);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("encodedPassword"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
            user = userRepository.findByEmail(defaultEmail);
            cartService.initCartIfNotExists(user.getId());
            System.out.println("User " + i + " created");
        }
    }

    private void createDefaultAdminIfNotExists() {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        for (int i = 1; i <= 2; i++) {
            String defaultEmail = "admin" + i + "@gmail.com";
            if (userRepository.existsByEmail(defaultEmail)) {
                continue;
            }
            ShopUser user = new ShopUser();
            user.setFirstName("The Admin");
            user.setLastName("Admin" + i);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("encodedPassword"));
            user.setRoles(Set.of(adminRole));
            userRepository.save(user);
            user = userRepository.findByEmail(defaultEmail);
            cartService.initCartIfNotExists(user.getId());
            System.out.println("Admin " + i + " created");
        }
    }

    private void createDefaultRoleIfNotExists(Set<String> roles) {
        roles.stream().filter(role -> roleRepository.findByName(role) == null).map(Role::new).forEach(roleRepository::save);
    }
}
