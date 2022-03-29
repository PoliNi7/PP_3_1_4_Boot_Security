package ru.kata.spring.boot_security.demo.util;

import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class Init {
    private final UserService userService;
    private final RoleService roleService;

    public Init(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void init(){
        Role roleA = new Role("ROLE_ADMIN");
        roleService.addRole(roleA);
        Role roleU = new Role("ROLE_USER");
        roleService.addRole(roleU);
        Set<Role> roles = new HashSet<>();
        roles.add(roleA);
        roles.add(roleU);
        Set<Role> roleAdmin = new HashSet<>();
        roleAdmin.add(roleA);
        Set<Role> roleUser = new HashSet<>();
        roleUser.add(roleU);
        userService.addUser(new User("1", "1", "1@mail.ru", "1", roles));
        userService.addUser(new User("2", "2", "2@mail.ru", "2", roleAdmin));
        userService.addUser(new User("3", "3", "3@mail.ru", "3", roleUser));
        userService.addUser(new User("4", "4", "4@mail.ru", "4", roleUser));
        userService.addUser(new User("5", "5", "5@mail.ru", "5", roleUser));
        userService.addUser(new User("6", "6", "6@mail.ru", "6", roleUser));
    }
}

//добавлять роли при создании и возможность их менять
