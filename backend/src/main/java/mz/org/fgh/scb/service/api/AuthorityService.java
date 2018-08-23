/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import java.util.List;

import mz.org.fgh.scb.model.entity.Authority;

/**
 * Defines the services api of Authorities
 * 
 * @author Damasceno Lopes
 *
 */
public interface AuthorityService {

	/**
	 * Returns all Authorities
	 * 
	 * @return all Authorities
	 */
	List<Authority> findAllByOrderByNameAsc();

}
