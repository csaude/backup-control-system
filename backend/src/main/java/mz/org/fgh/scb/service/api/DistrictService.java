/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mz.org.fgh.scb.model.entity.District;

/**
 * Defines the services api of Districts
 * 
 * @author Damasceno Lopes
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
	District findByUuid(String uuid);

	/**
	 * Returns all Districts
	 * 
	 * @return all Districts
	 */
	List<District> findAllByOrderByNameAsc();

	/**
	 * Returns all District paginated with the given name and lifecycle
	 * 
	 * @param name     the District name
	 * @param canceled the District lifecycle (canceled or not canceled)
	 * @param pageable the pageable properties
	 * @return all Districts paginated with the given District name and lifecycle
	 */
	Page<District> findAllByName(String name, boolean canceled, Pageable pageable);

	/**
	 * Returns all Districts paginated with the given District name, Logged User username or lifecycle
	 * 
	 * @param name     the District name
	 * @param username the Logged User username
	 * @param canceled the District lifecycle (canceled or not canceled)
	 * @param pageable the pageable properties
	 * @return all Districts paginated with the given District name, Logged username or lifecycle
	 */
	Page<District> findAllByNameAndUsername(String name, String username, boolean canceled, Pageable pageable);

	/**
	 * @return date of last backup received by District
	 */
	List<Object[]> findLastBackupReceivedByDistrict();

	/**
	 * @return date of last backup restored by District
	 */
	List<Object[]> findLastBackupRestoredByDistrict();

	/**
	 * @return server and date of last sync by District
	 */
	List<Object[]> findLastSyncByDistrict();

	/**
	 * @return number of backups received by District on previous month
	 */
	List<Object[]> findBackupReceivedByDistrictOnPreviousMonth();

	/**
	 * @return number of backups received by District on this month
	 */
	List<Object[]> findBackupReceivedByDistrictOnThisMonth();

	/**
	 * @return number of backups received on the last 12 months
	 */
	List<Object[]> findBackupReceivedOnLast12Months();
}
