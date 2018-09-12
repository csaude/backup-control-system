/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Send;

/**
 * Defines the functionality for persisting Sends
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface SendRepository extends JpaRepository<Send, Long>, JpaSpecificationExecutor<Send> {

	/**
	 * Returns the Send with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Send with the given uuid
	 */
	Send findOneByUuid(String uuid);

}
