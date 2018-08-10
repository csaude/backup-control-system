package mz.org.fgh.scb.security;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import mz.org.fgh.scb.model.entity.Authority;
import mz.org.fgh.scb.model.entity.User;

/**
 * @author damasceno.lopes
 *
 */
public class MyUserPrincipal implements UserDetails {

	BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(11);

	private static final long serialVersionUID = 1L;
	private User user;

	public MyUserPrincipal(User user) {
		this.setUser(user);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		ArrayList<String> role1 = new ArrayList<String>();
		for (Authority a : user.getAuthorities()) {
			role1.add(a.getName());
		}

		String role2 = role1.toString().replace("[", "");
		String roles = role2.toString().replace("]", "");

		return AuthorityUtils.commaSeparatedStringToAuthorityList(roles);
	}

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return getUser().isEnabled();
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}