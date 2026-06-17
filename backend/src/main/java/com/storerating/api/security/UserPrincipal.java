package com.storerating.api.security;

import com.storerating.api.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
/**
 * Represents the UserPrincipal class.
 */

public class UserPrincipal implements UserDetails {
    private final Long id;
    private final String name;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    /**
     * Constructs a new UserPrincipal.
     */

    public UserPrincipal(Long id, String name, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }
    /**
     * Executes the Creates  operation.
     */

    public static UserPrincipal create(User user) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        return new UserPrincipal(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(authority)
        );
    }
    /**
     * Gets the id.
     * @return the id
     */

    public Long getId() {
        return id;
    }
    /**
     * Gets the name.
     * @return the name
     */

    public String getName() {
        return name;
    }
    /**
     * Gets the email.
     * @return the email
     */

    public String getEmail() {
        return email;
    }
    /**
     * Gets the username.
     * @return the username
     */

    @Override
    public String getUsername() {
        return email; // We use email as the username for authentication
    }
    /**
     * Gets the password.
     * @return the password
     */

    @Override
    public String getPassword() {
        return password;
    }
    /**
     * Gets the authorities.
     * @return the authorities
     */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    /**
     * Gets the accountNonExpired.
     * @return the accountNonExpired
     */

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    /**
     * Gets the accountNonLocked.
     * @return the accountNonLocked
     */

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    /**
     * Gets the credentialsNonExpired.
     * @return the credentialsNonExpired
     */

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    /**
     * Gets the enabled.
     * @return the enabled
     */

    @Override
    public boolean isEnabled() {
        return true;
    }
}
