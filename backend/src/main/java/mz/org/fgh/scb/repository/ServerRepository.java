/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import mz.org.fgh.scb.model.entity.Server;

/**
 * Defines the functionality for persisting Servers
 * 
 * @author Damasceno Lopes
 *
 */
public interface ServerRepository extends JpaRepository<Server, Long>, JpaSpecificationExecutor<Server> {

	/**
	 * Returns the Server with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Server with the given uuid
	 */
	Server findOneByUuid(String uuid);

	/**
	 * Returns all Servers
	 * 
	 * @return all Servers
	 */
	@Query("SELECT s FROM server s JOIN s.district d WHERE s.canceled=0 ORDER BY d.name,s.name ASC")
	List<Server> findAllByOrderByNameAsc();

}
