/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mz.org.fgh.scb.model.entity.Receive;

/**
 * Defines the functionality for persisting Receives
 * 
 * @author Damasceno Lopes
 *
 */
public interface ReceiveRepository extends JpaRepository<Receive, Long> {

	/**
	 * Returns the Receive with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Receive with the given uuid
	 */
	Receive findByUuid(String uuid);

	/* JPQL */
	/**
	 * Returns the Receive with the given Send id
	 * 
	 * @param send_id the Send id
	 * @return the Receive with the given Send id
	 */
	@Query("SELECT r FROM receive r JOIN r.send s WHERE s.send_id=:send_id AND s.canceled=0 AND r.canceled=0")
	public Receive findBySendId(@Param("send_id") Long send_id);

	/**
	 * Returns all Receives paginated with the given District id
	 * 
	 * @param district_id the District id
	 * @param pageable    he pageable properties
	 * @return all Receives paginated with the given District id
	 */
	@Query("SELECT r FROM receive r JOIN r.send s JOIN s.district d WHERE d.district_id=:district_id AND s.canceled=0 AND r.canceled=0 ORDER BY s.backup_date DESC")
	public Page<Receive> findByDistrictId(@Param("district_id") Long district_id, Pageable pageable);

	/**
	 * Returns all Receives paginated with the given District id and Send backup date range
	 * 
	 * @param district_id the District id
	 * @param pageable    the pageable properties
	 * @param from        the Send backup date from
	 * @param until       the Send backup date until
	 * @return all Receives paginated with the given District id and Send backup date range
	 */
	@Query("SELECT r FROM receive r JOIN r.send s JOIN s.district d WHERE d.district_id=:district_id AND s.canceled=0 AND r.canceled=0 AND (s.backup_date BETWEEN :from AND :until ) ORDER BY s.backup_date DESC")
	public Page<Receive> findByDistrictIdAndSendBackupDateRange(@Param("district_id") Long district_id, Pageable pageable, @Param("from") Date from, @Param("until") Date until);

	/**
	 * Returns all Receives of Districts of the given Logged User username
	 * 
	 * @param pageable the pageable properties
	 * @param username the Logged User username
	 * @return all Receives of Districts of the given Logged User username
	 */
	@Query("SELECT distinct r FROM receive r JOIN r.send s JOIN s.district d JOIN d.users u WHERE u.username=:username AND s.canceled=0 AND r.canceled=0 ORDER BY s.backup_date DESC")
	public Page<Receive> findByUsername(Pageable pageable, @Param("username") String username);

	/**
	 * Returns all Receives of Districts of the given Logged User username and Send backup date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the Send backup date from
	 * @param until    the Send backup date until
	 * @param username the Logged User username
	 * @return all Receives of Districts of the given Logged User username and Send backup date range
	 */
	@Query("SELECT distinct r FROM receive r JOIN r.send s JOIN s.district d JOIN d.users u WHERE u.username=:username AND s.canceled=0 AND r.canceled=0 AND (s.backup_date BETWEEN :from AND :until ) ORDER BY s.backup_date DESC")
	public Page<Receive> findByUsernameAndSendBackupDateRange(Pageable pageable, @Param("from") Date from, @Param("until") Date until, @Param("username") String username);

	/**
	 * Returns all Receives with the given Send backup date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the Send backup date from
	 * @param until    the Send backup date until
	 * @return all Receives with the given Send backup date range
	 */
	@Query("SELECT distinct r FROM receive r JOIN r.send s JOIN s.district d WHERE s.canceled=0 AND r.canceled=0 AND (s.backup_date BETWEEN :from AND :until ) ORDER BY s.backup_date DESC")
	public Page<Receive> findBySendBackupDateRange(Pageable pageable, @Param("from") Date from, @Param("until") Date until);

	/**
	 * Returns all Receives paginated
	 * 
	 * @param pageable the pageable properties
	 * @return all Receives paginated
	 */
	@Query("SELECT r FROM receive r JOIN r.send s WHERE s.canceled=0 AND r.canceled=0 ORDER BY s.backup_date DESC")
	public Page<Receive> findAllReceives(Pageable pageable);

	/* Native Queries */
	/**
	 * Returns all emails of District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ud.district_id=:district_id AND ua.authority_id IN (3,6)))) AS person", nativeQuery = true)
	public List<String> findUsersForNotification(@Param("district_id") Long district_id);

}
