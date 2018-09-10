/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.User;

/**
 * Defines the functionality for persisting Users
 * 
 * @author Damasceno Lopes
 *
 */
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

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
	User findOneByUsername(String username);

	/**
	 * Returns all Users
	 * 
	 * @return all Users
	 */
	List<User> findAllByOrderByUsernameAsc();

}
