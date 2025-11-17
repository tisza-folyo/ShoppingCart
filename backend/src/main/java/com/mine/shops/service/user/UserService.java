package com.mine.shops.service.user;

import com.mine.shops.dto.UserDto;
import com.mine.shops.exceptions.AlreadyExistsException;
import com.mine.shops.exceptions.ResourceNotFoundException;
import com.mine.shops.model.Role;
import com.mine.shops.model.User;
import com.mine.shops.repository.RoleRepository;
import com.mine.shops.repository.UserRepository;
import com.mine.shops.request.CreateUserRequest;
import com.mine.shops.request.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public List<UserDto> getAllUsers() { return userRepository.findAll().stream().map(this::convertUserToDto).collect(Collectors.toList()); }

    @Override
    public User createUser(CreateUserRequest request, Role role) {
        return Optional.of(request).filter(user -> !userRepository.existsByEmail(request.getEmail())).map(req ->{
            User user = new User();
            user.setEmail(req.getEmail());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setFirstName(req.getFirstName());
            user.setLastName(req.getLastName());
            user.setRoles(Set.of(role));
            return userRepository.save(user);
        }).orElseThrow(() -> new AlreadyExistsException(request.getEmail() +" already exists"));
    }

    @Override
    public User updateUserRole(Long id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.getRoles().forEach(role -> role.getUsers().remove(user));

        Set<Role> newRoles = new HashSet<>();
        newRoles.add(newRole);
        user.setRoles(newRoles);
        newRole.getUsers().add(user);

        return userRepository.save(user);

    }

    @Override
    public User updateUser(UpdateUserRequest request, Long id) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.findById(id).ifPresentOrElse(userRepository::delete, () -> {
            throw new ResourceNotFoundException("User not found");
        });
    }

    @Override
    public UserDto convertUserToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email);
    }
}
