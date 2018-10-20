/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.authority;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Damasceno Lopes
 *
 */
public interface AuthorityRepository extends JpaRepository<Authority, Long> {

	public List<Authority> findAllByOrderByNameAsc();

}
