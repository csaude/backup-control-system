/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mz.org.fgh.scb.model.entity.Sync;

/**
 * Defines the functionality for persisting Syncs
 * 
 * @author Damasceno Lopes
 *
 */
public interface SyncRepository extends JpaRepository<Sync, Long>, JpaSpecificationExecutor<Sync> {

	/**
	 * Returns the Sync with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Sync with the given uuid
	 */
	Sync findByUuid(String uuid);

	//---------------------------------------
	// FOR USER NOTIFICATION
	//---------------------------------------
	/**
	 * Returns the number of Syncs in progress
	 * 
	 * @return the number of Syncs in progress
	 */
	@Query("SELECT COUNT(*) FROM sync s WHERE s.end_time=null AND s.canceled=0 AND DATE(s.starttime)=CURDATE()")
	public int findInProgress();

	/**
	 * Returns the number Syncs in progress on Districts of the given Logged User username
	 * 
	 * @param username the Logged User username
	 * @return the number Syncs in progress on Districts of the given Logged User username
	 */
	@Query("SELECT COUNT(distinct s) FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u  WHERE s.end_time=null AND s.canceled=0 AND date(s.starttime)=CURDATE() AND u.username=:username")
	public int findInProgressByUser(@Param("username") String username);

	/**
	 * Returns all emails of District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ua.authority_id IN(1,5) OR (ud.district_id=:district_id AND ua.authority_id IN (3,6))))) AS person", nativeQuery = true)
	public List<String> findUsersForNotification(@Param("district_id") Long district_id);

}
