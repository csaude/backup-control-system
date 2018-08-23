/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mz.org.fgh.scb.model.entity.Send;

/**
 * Defines the services api of Sends
 * 
 * @author Damasceno Lopes
 *
 */
public interface SendService {

	/**
	 * Saves the send and return the Send Saved
	 * 
	 * @param send the Send
	 * @return the Send Saved
	 */
	Send save(Send send);

	/**
	 * Deletes the Send
	 * 
	 * @param send the Send
	 */
	void delete(Send send);

	/**
	 * Returns the Send with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Send with the given uuid
	 */
	Send findByUuid(String uuid);

	/**
	 * Returns all Sends paginated with the given District id
	 * 
	 * @param district_id the District id
	 * @param pageable    he pageable properties
	 * @return all Receives paginated with the given District id
	 */
	Page<Send> findByDistrictId(Long district_id, Pageable pageable);

	/**
	 * Returns all Sends paginated with the given District id and backup date range
	 * 
	 * @param district_id the District id
	 * @param pageable    the pageable properties
	 * @param from        the backup date from
	 * @param until       the backup date until
	 * @return all Sends paginated with the given District id and backup date range
	 */
	Page<Send> findByDistrictIdAndBackupDateRange(Long district_id, Pageable pageable, Date from, Date until);

	/**
	 * Returns all Sends of Districts of the given Logged User username
	 * 
	 * @param pageable the pageable properties
	 * @param username the Logged User username
	 * @return all Sends of Districts of the given Logged User username
	 */
	Page<Send> findByUsername(Pageable pageable, String username);

	/**
	 * Returns all Receives of Districts of the given Logged User username and backup date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the backup date from
	 * @param until    the backup date until
	 * @param username the Logged User username
	 * @return all Receives of Districts of the given Logged User username and backup date range
	 */
	Page<Send> findByUsernameAndBackupDateRange(Pageable pageable, Date from, Date until, String username);

	/**
	 * Returns all Sends not received
	 * 
	 * @param pageable the pageable properties
	 * @return all Sends paginated
	 */
	Page<Send> findAllNotReceived(Pageable pageable);

}
