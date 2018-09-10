/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Sync;

/**
 * Defines the services api of Syncs
 * 
 * @author Damasceno Lopes
 *
 */
public interface SyncService {

	/**
	 * Saves the sync and return the Sync Saved
	 * 
	 * @param sync the Sync
	 * @return the Sync Saved
	 */
	Sync save(Sync sync);

	/**
	 * Deletes the Sync
	 * 
	 * @param sync the Sync
	 */
	void delete(Sync sync);

	/**
	 * Returns the Sync with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Sync with the given uuid
	 */
	Sync findOneByUuid(String uuid);

	/**
	 * Returns all Syncs paginated
	 * 
	 * @param spec        the Sync Spcification
	 * @param pageRequest the PageRequest
	 * @return all Syncs paginated
	 */
	Page<Sync> findAll(Specification<Sync> spec, PageRequest pageRequest);
}
