/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.User;
import mz.org.fgh.scb.service.impl.UserServiceImpl;

/**
 * @author damasceno.lopes
 *
 */
@Service
public class MyUserDetailsService implements UserDetailsService {

	@Autowired
	private UserServiceImpl userServiceImpl;

	@Override
	public UserDetails loadUserByUsername(String username) {
		User user = userServiceImpl.findByUsername(username);
		return new MyUserPrincipal(user);
	}
}
