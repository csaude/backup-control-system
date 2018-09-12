/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Server;

/**
 * Defines the services api of Server
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface ServerService {

	/**
	 * Saves the server and return the Server Saved
	 * 
	 * @param server the Server
	 * @return the Server Saved
	 */
	Server save(Server server);

	/**
	 * Deletes the Server
	 * 
	 * @param server the Server
	 */
	void delete(Server server);

	/**
	 * Returns the Server with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Server with the given uuid
	 */
	Server findOneByUuid(String uuid);

	/**
	 * Returns all Servers paginated with given specification
	 * 
	 * @param spec        the specification
	 * @param pageRequest the PageRequest properties
	 * @return all Servers paginated with given specification
	 */
	Page<Server> findAll(Specification<Server> spec, PageRequest pageRequest);

}
