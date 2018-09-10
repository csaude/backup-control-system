/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Ironkey;

/**
 * Defines the services api of Ironkeys
 * 
 * @author Damasceno Lopes
 *
 */
public interface IronkeyService {

	/**
	 * Saves the Ironkey and return the Ironkey Saved
	 * 
	 * @param ironkey the Ironkey
	 * @return the Ironkey Saved
	 */
	Ironkey save(Ironkey ironkey);

	/**
	 * Deletes the Ironkey
	 * 
	 * @param ironkey the Ironkey
	 */
	void delete(Ironkey ironkey);

	/**
	 * Returns the Ironkey with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Ironkey with the given uuid
	 */
	Ironkey findByUuid(String uuid);

	/**
	 * Returns all Ironkeys Paginated with given specification
	 * 
	 * @param spec        the Specification
	 * @param pageRequest the PageRequest
	 * @return all Ironkeys Paginated with given specification
	 */
	Page<Ironkey> findAll(Specification<Ironkey> spec, PageRequest pageRequest);

}
