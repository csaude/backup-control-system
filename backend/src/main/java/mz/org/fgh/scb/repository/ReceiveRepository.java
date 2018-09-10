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

import mz.org.fgh.scb.model.entity.Receive;

/**
 * Defines the functionality for persisting Receives
 * 
 * @author Damasceno Lopes
 *
 */
public interface ReceiveRepository extends JpaRepository<Receive, Long>, JpaSpecificationExecutor<Receive> {

	/**
	 * Returns the Receive with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Receive with the given uuid
	 */
	Receive findByUuid(String uuid);

	/* JPQL */
	/**
	 * Returns the Receive with the given Send uuid
	 * 
	 * @param uuid the Send uuid
	 * @return the Receive with the given Send uuid
	 */
	@Query("SELECT r FROM receive r JOIN r.send s WHERE s.uuid=:uuid AND s.canceled=0 AND r.canceled=0")
	public Receive findBySendUuid(@Param("uuid") String uuid);

	// -----------------------------------------------------------
	// USER NOTIFICATION
	// -----------------------------------------------------------
	/**
	 * Returns all emails of District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ud.district_id=:district_id AND ua.authority_id IN (3,6)))) AS person", nativeQuery = true)
	public List<String> findUsersForNotification(@Param("district_id") Long district_id);

}
