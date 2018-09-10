/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Receive;

/**
 * Defines the services api of Receives
 * 
 * @author Damasceno Lopes
 *
 */
public interface ReceiveService {
	
	/**
	 * Saves the receive and return the Receive Saved
	 * 
	 * @param receive the Receive
	 * @return the Receive Saved
	 */
	Receive save(Receive receive);

	/**
	 * Deletes the Receive
	 * 
	 * @param receive the Receive
	 */
	void delete(Receive receive);

	/**
	 * Returns the Receive with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Receive with the given uuid
	 */
	Receive findOneByUuid(String uuid);

	/**
	 * Returns all Receive paginated
	 * 
	 * @param spec        the Receive Spcification
	 * @param pageRequest the PageRequest
	 * @return all Sends paginated
	 */
	Page<Receive> findAll(Specification<Receive> spec, PageRequest pageRequest);

	/**
	 * Returns the Receive with the given Send uuid
	 * 
	 * @param uuid the Send uuid
	 * @return the Receive with the given Send uuid
	 */
	Receive findOneBySendUuid(String uuid);

}
