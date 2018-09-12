/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Sync;

/**
 * Defines the functionality for persisting Syncs
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface SyncRepository extends JpaRepository<Sync, Long>, JpaSpecificationExecutor<Sync> {

	/**
	 * Returns the Sync with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Sync with the given uuid
	 */
	Sync findOneByUuid(String uuid);

}
