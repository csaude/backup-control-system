/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mz.org.fgh.scb.model.entity.Authority;

/**
 * Defines the functionality for persisting Authorities
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface AuthorityRepository extends JpaRepository<Authority, Long> {

	/**
	 * Returns all Authorities
	 * 
	 * @return all Authorities
	 */
	public List<Authority> findAllByOrderByNameAsc();

}
