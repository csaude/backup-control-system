/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.District;

/**
 * Defines the functionality for persisting Districts
 * 
 * @author Damasceno Lopes
 *
 */
public interface DistrictRepository extends JpaRepository<District, Long>, JpaSpecificationExecutor<District> {

	/**
	 * Returns the District with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the District with the given uuid
	 */
	public District findOneByUuid(String uuid);
}
