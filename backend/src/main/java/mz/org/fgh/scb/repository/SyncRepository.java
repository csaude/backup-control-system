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

import mz.org.fgh.scb.model.entity.Sync;

/**
 * Defines the functionality for persisting Syncs
 * 
 * @author Damasceno Lopes
 *
 */
public interface SyncRepository extends JpaRepository<Sync, Long> {

	/**
	 * Returns the Sync with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Sync with the given uuid
	 */
	Sync findByUuid(String uuid);

	/* JPQL */
	/**
	 * Returns all Syncs paginated
	 * 
	 * @see org.springframework.data.repository.PagingAndSortingRepository#findAll(org.springframework.data.domain.Pageable)
	 */
	@Query("SELECT s FROM sync s WHERE s.canceled=0 ORDER BY s.start_time DESC")
	public Page<Sync> findAll(Pageable pageable);

	/**
	 * Returns all Syncs paginated by date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the date from
	 * @param until    the date until
	 * @return all Syncs paginated by date range
	 */
	@Query("SELECT s FROM sync s WHERE s.canceled=0 AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findAllByDateRange(Pageable pageable, @Param("from") Date from, @Param("until") Date until);

	/**
	 * Returns all Syncs paginated with the given District id
	 * 
	 * @param district_id the District id
	 * @param pageable    he pageable properties
	 * @return all Syncs paginated with the given District id
	 */
	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d WHERE d.district_id=:district_id AND s.canceled=0 ORDER BY s.start_time DESC")
	public Page<Sync> findByDistrictId(@Param("district_id") Long district_id, Pageable pageable);

	/**
	 * Returns all Syncs paginated with the given District id and date range
	 * 
	 * @param district_id the District id
	 * @param pageable    the pageable properties
	 * @param from        the date from
	 * @param until       the until
	 * @return all Syncs paginated with the given District id and date range
	 */
	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d WHERE d.district_id=:district_id AND s.canceled=0 AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findByDistrictIdAndDateRange(@Param("district_id") Long district_id, Pageable pageable, @Param("from") Date from, @Param("until") Date until);

	/**
	 * Returns all Syncs of Districts of the given Logged User username
	 * 
	 * @param pageable the pageable properties
	 * @param username the Logged User username
	 * @return all Syncs of Districts of the given Logged User username
	 */
	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u WHERE s.canceled=0 AND u.username=:username ORDER BY s.start_time DESC")
	public Page<Sync> findByUsername(Pageable pageable, @Param("username") String username);

	/**
	 * Returns all Syncs of Districts of the given Logged User username and date range
	 * 
	 * @param pageable the pageable properties
	 * @param from     the date from
	 * @param until    the date until
	 * @param username the Logged User username
	 * @return all Syncs of Districts of the given Logged User username and date range
	 */
	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u WHERE s.canceled=0 AND u.username=:username AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findByUsernameAndDateRange(Pageable pageable, @Param("from") Date from, @Param("until") Date until, @Param("username") String username);

	/**
	 * Returns all Syncs paginated with the given Server id
	 * 
	 * @param server_id the Server id
	 * @param pageable  the pageable properties
	 * @return all Syncs paginated with the given Server id
	 */
	@Query("SELECT s FROM sync s JOIN s.server se WHERE se.server_id=:server_id AND s.canceled=0 ORDER BY s.start_time DESC")
	public Page<Sync> findByServerId(@Param("server_id") Long server_id, Pageable pageable);

	/**
	 * Returns all Syncs paginated with the given Server id and date range
	 * 
	 * @param server_id the Server id
	 * @param pageable  the pageable properties
	 * @param from      the date from
	 * @param until     the date until
	 * @return all Syncs paginated with the given Server id and date range
	 */
	@Query("SELECT s FROM sync s JOIN s.server se WHERE se.server_id=:server_id AND s.canceled=0 AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findByServerIdAndDateRange(@Param("server_id") Long server_id, Pageable pageable, @Param("from") Date from, @Param("until") Date until);

	/**
	 * Returns the number of Syncs in progress
	 * 
	 * @return the number of Syncs in progress
	 */
	@Query("SELECT COUNT(*) FROM sync s WHERE s.end_time=null AND s.canceled=0 AND DATE(s.start_time)=CURDATE()")
	public int findInProgress();

	/**
	 * Returns the number Syncs in progress on Districts of the given Logged User username
	 * 
	 * @param username the Logged User username
	 * @return the number Syncs in progress on Districts of the given Logged User username
	 */
	@Query("SELECT COUNT(distinct s) FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u  WHERE s.end_time=null AND s.canceled=0 AND date(s.start_time)=CURDATE() AND u.username=:username")
	public int findInProgressByUser(@Param("username") String username);

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
