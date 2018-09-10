/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Transporter;

/**
 * Defines the functionality for persisting Transporters
 * 
 * @author Damasceno Lopes
 *
 */
public interface TransporterRepository extends JpaRepository<Transporter, Long>, JpaSpecificationExecutor<Transporter> {

	/**
	 * Returns the Transporter with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Transporter with the given uuid
	 */
	Transporter findByUuid(String uuid);

}
