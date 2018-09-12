/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Send;

/**
 * Defines the services api of Sends
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface SendService {

	/**
	 * Saves the send and return the Send Saved
	 * 
	 * @param send the Send
	 * @return the Send Saved
	 */
	Send save(Send send);

	/**
	 * Deletes the Send
	 * 
	 * @param send the Send
	 */
	void delete(Send send);

	/**
	 * Returns the Send with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Send with the given uuid
	 */
	Send findOneByUuid(String uuid);
	
	/**
	 * Returns all Send paginated
	 * 
	 * @param spec        the Send Spcification
	 * @param pageRequest the PageRequest
	 * @return all Sends paginated
	 */
	Page<Send> findAll(Specification<Send> spec, PageRequest pageRequest);

}
