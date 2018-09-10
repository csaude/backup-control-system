/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Transporter;

/**
 * Defines the services api of Transporters
 * 
 * @author Damasceno Lopes
 *
 */
public interface TransporterService {

	/**
	 * Saves the transporter and return the Transporter Saved
	 * 
	 * @param transporter the Transporter
	 * @return the Transporter Saved
	 */
	Transporter save(Transporter transporter);

	/**
	 * Deletes the Transporter
	 * 
	 * @param transporter the Transporter
	 */
	void delete(Transporter transporter);

	/**
	 * Returns the Transporter with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Transporter with the given uuid
	 */
	Transporter findByUuid(String uuid);

	/**
	 * Returns all Transporters paginated with given specification
	 * 
	 * @param spec the specification
	 * @param pageRequest the PageRequest properties
	 * @return all Transporters paginated with given specification
	 */
	Page<Transporter> findAll(Specification<Transporter> spec, PageRequest pageRequest);

}
