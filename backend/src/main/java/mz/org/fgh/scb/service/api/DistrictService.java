/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.District;

/**
 * Defines the services api of Districts
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface DistrictService {

	/**
	 * Saves the district and return the District Saved
	 * 
	 * @param district the District
	 * @return the District Saved
	 */
	District save(District district);

	/**
	 * Deletes the District
	 * 
	 * @param district the District
	 */
	void delete(District district);

	/**
	 * Returns the District with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the District with the given uuid
	 */
	District findOneByUuid(String uuid);

	/**
	 * Returns all District paginated
	 * 
	 * @param spec        the District Spcification
	 * @param pageRequest the PageRequest
	 * @return all District paginated
	 */
	Page<District> findAll(Specification<District> spec, PageRequest pageRequest);
}
