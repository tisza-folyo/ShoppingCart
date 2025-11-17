package com.mine.shops.service.user;

import com.mine.shops.dto.UserDto;
import com.mine.shops.model.Role;
import com.mine.shops.model.User;
import com.mine.shops.request.CreateUserRequest;
import com.mine.shops.request.UpdateUserRequest;

import java.util.List;

public interface IUserService {
    User getUserById(Long id);

    List<UserDto> getAllUsers();

    User createUser(CreateUserRequest request, Role role);

    User updateUserRole(Long id, Role role);

    User updateUser(UpdateUserRequest request, Long id);
    void deleteUser(Long id);

    UserDto convertUserToDto(User user);

    User getAuthenticatedUser();
}
