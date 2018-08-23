/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
	Sync findByUuid(String uuid);

	/**
	 * Returns all Syncs paginated
	 * 
	 * @param pageable the pageable properties
	 * @return all Syncs paginated
	 */
	Page<Sync> findAll(Pageable pageable);

	/**
	 * Returns all Syncs paginated by date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the date from
	 * @param until    the date until
	 * @return all Syncs paginated by date range
	 */
	Page<Sync> findAllByDateRange(Pageable pageable, Date from, Date until);

	/**
	 * Returns all Syncs paginated with the given District id
	 * 
	 * @param district_id the District id
	 * @param pageable    he pageable properties
	 * @return all Syncs paginated with the given District id
	 */
	Page<Sync> findByDistrictId(Long district_id, Pageable pageable);

	/**
	 * Returns all Syncs paginated with the given District id and date range
	 * 
	 * @param district_id the District id
	 * @param pageable    the pageable properties
	 * @param from        the date from
	 * @param until       the until
	 * @return all Syncs paginated with the given District id and date range
	 */
	Page<Sync> findByDistrictIdAndDateRange(Long district_id, Pageable pageable, Date from, Date until);

	/**
	 * Returns all Syncs paginated with the given Server id
	 * 
	 * @param server_id the Server id
	 * @param pageable  the pageable properties
	 * @return all Syncs paginated with the given Server id
	 */
	Page<Sync> findByServerId(Long server_id, Pageable pageable);

	/**
	 * Returns all Syncs paginated with the given Server id and date range
	 * 
	 * @param server_id the Server id
	 * @param pageable  the pageable properties
	 * @param from      the date from
	 * @param until     the date until
	 * @return all Syncs paginated with the given Server id and date range
	 */
	Page<Sync> findByServerIdAndDateRange(Long server_id, Pageable pageable, Date from, Date until);

	/**
	 * Returns all Syncs of Districts of the given Logged User username
	 * 
	 * @param pageable the pageable properties
	 * @param username the Logged User username
	 * @return all Syncs of Districts of the given Logged User username
	 */
	Page<Sync> findByUsername(Pageable pageable, String username);

	/**
	 * Returns all Syncs of Districts of the given Logged User username and date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the date from
	 * @param until    the date until
	 * @param username the Logged User username
	 * @return all Syncs of Districts of the given Logged User username and date range
	 */
	Page<Sync> findByUserIdAndDateRange(Pageable pageable, Date from, Date until, String username);

}
