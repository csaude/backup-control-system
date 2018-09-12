/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.User;

/**
 * Defines the functionality for persisting Users
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface UserService {

	/**
	 * Saves the user and return the User Saved
	 * 
	 * @param user the User
	 * @return the User Saved
	 */
	User save(User user);

	/**
	 * Deletes the User
	 * 
	 * @param user the User
	 */
	void delete(User user);

	/**
	 * Returns the User with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the User with the given uuid
	 */
	User findOneByUuid(String uuid);

	/**
	 * Returns the User with the given username
	 * 
	 * @param username the username
	 * @return the User with the given username
	 */
	User findByUsername(String username);

	/**
	 * Returns all Users paginated with given specification
	 * 
	 * @param spec the specification
	 * @param pageRequest the PageRequest properties
	 * @return all Users paginated with given specification
	 */
	Page<User> findAll(Specification<User> spec, PageRequest pageRequest);

}
