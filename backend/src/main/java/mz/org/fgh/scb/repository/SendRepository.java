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

import mz.org.fgh.scb.model.entity.Send;

/**
 * Defines the functionality for persisting Sends
 * 
 * @author Damasceno Lopes
 *
 */
public interface SendRepository extends JpaRepository<Send, Long>, JpaSpecificationExecutor<Send> {

	/**
	 * Returns the Send with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Send with the given uuid
	 */
	Send findByUuid(String uuid);
	
	//-----------------------------------------------------------
	//USER NOTIFICATION
	//-----------------------------------------------------------
	/**
	 * Returns the number of all Sends not received
	 * 
	 * @return the number of all Sends not received
	 */
	@Query("SELECT COUNT(*) FROM send s WHERE s.received=0 AND s.canceled=0")
	public int findNumberOfAllNotReceived();

	/* Native Queries */
	/**
	 * Returns all emails of District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ua.authority_id IN(1,5) OR (ud.district_id=:district_id AND ua.authority_id IN (3,6))))) AS person", nativeQuery = true)
	public List<String> findUsersForNotification(@Param("district_id") Long district_id);

}
