/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mz.org.fgh.scb.model.entity.Receive;

/**
 * Defines the services api of Receives
 * 
 * @author Damasceno Lopes
 *
 */
public interface ReceiveService {
	
	/**
	 * Saves the receive and return the Receive Saved
	 * 
	 * @param receive the Receive
	 * @return the Receive Saved
	 */
	Receive save(Receive receive);

	/**
	 * Deletes the Receive
	 * 
	 * @param receive the Receive
	 */
	void delete(Receive receive);

	/**
	 * Returns the Receive with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Receive with the given uuid
	 */
	Receive findByUuid(String uuid);

	/**
	 * Returns all Receives paginated with the given District id
	 * 
	 * @param district_id the District id
	 * @param pageable    he pageable properties
	 * @return all Receives paginated with the given District id
	 */
	Page<Receive> findByDistrictId(Long district_id, Pageable pageable);

	/**
	 * Returns all Receives paginated with the given District id and Send backup date range
	 * 
	 * @param district_id the District id
	 * @param pageable    the pageable properties
	 * @param from        the Send backup date from
	 * @param until       the Send backup date until
	 * @return all Receives paginated with the given District id and Send backup date range
	 */
	Page<Receive> findByDistrictIdAndSendBackupDateRange(Long district_id, Pageable pageable, Date from, Date until);

	/**
	 * Returns all Receives of Districts of the given Logged User username
	 * 
	 * @param pageable the pageable properties
	 * @param username the Logged User username
	 * @return all Receives of Districts of the given Logged User username
	 */
	Page<Receive> findByUsername(Pageable pageable, String username);

	/**
	 * Returns all Receives of Districts of the given Logged User username and Send backup date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the Send backup date from
	 * @param until    the Send backup date until
	 * @param username the Logged User username
	 * @return all Receives of Districts of the given Logged User username and Send backup date range
	 */
	Page<Receive> findByUsernameAndSendDateBackupRange(Pageable pageable, Date from, Date until, String username);
	
	/**
	 * Returns all Receives with the given Send backup date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the Send backup date from
	 * @param until    the Send backup date until
	 * @return all Receives with the given Send backup date range
	 */
	Page<Receive> findBySendBackupDateRange(Pageable pageable, Date from, Date until);

	/**
	 * Returns the Receive with the given Send id
	 * 
	 * @param send_id the Send id
	 * @return the Receive with the given Send id
	 */
	Receive findBySendId(Long send_id);

	/**
	 * Returns all Receives paginated
	 * 
	 * @param pageable the pageable properties
	 * @return all Receives paginated
	 */
	Page<Receive> findAllReceives(Pageable pageable);

}
