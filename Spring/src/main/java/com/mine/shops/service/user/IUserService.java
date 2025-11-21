package com.mine.shops.service.user;

import com.mine.shops.dto.UserDto;
import com.mine.shops.model.Role;
import com.mine.shops.model.ShopUser;
import com.mine.shops.request.CreateUserRequest;
import com.mine.shops.request.UpdateUserRequest;

import java.util.List;

public interface IUserService {
    ShopUser getUserById(Long id);

    List<UserDto> getAllUsers();

    ShopUser createUser(CreateUserRequest request, Role role);

    ShopUser updateUserRole(Long id, Role role);

    ShopUser updateUser(UpdateUserRequest request, Long id);
    void deleteUser(Long id);

    UserDto convertUserToDto(ShopUser user);

    ShopUser getAuthenticatedUser();
}
