/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mz.org.fgh.scb.model.entity.Receive;

/**
 * Defines the functionality for persisting Receives
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface ReceiveRepository extends JpaRepository<Receive, Long>, JpaSpecificationExecutor<Receive> {

	/**
	 * Returns the Receive with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Receive with the given uuid
	 */
	Receive findOneByUuid(String uuid);

	/* JPQL */
	/**
	 * Returns the Receive with the given Send uuid
	 * 
	 * @param uuid the Send uuid
	 * @return the Receive with the given Send uuid
	 */
	@Query("SELECT r FROM receive r JOIN r.send s WHERE s.uuid=:uuid AND s.canceled=0 AND r.canceled=0")
	public Receive findOneBySendUuid(@Param("uuid") String uuid);

	
}
