/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import mz.org.fgh.scb.model.entity.District;

/**
 * Defines the functionality for persisting Districts
 * 
 * @author Damasceno Lopes
 *
 */
public interface DistrictRepository extends JpaRepository<District, Long>, JpaSpecificationExecutor<District> {

	/**
	 * Returns the District with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the District with the given uuid
	 */
	public District findByUuid(String uuid);
	
	/* Native Queries for complex data extraction */
	//------------------------------------------------
	// DASHBOARD
	//------------------------------------------------
	/**
	 * @return date of last backup received by District
	 */
	@Query(value = "SELECT send.uuid,info.district_id,info.last_backup_received FROM (SELECT  MAX(details.send_id) AS send_id,details.district_id,details.last_backup_received FROM (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT(MAX(backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 )) backup_received GROUP BY name) lbr, (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT((backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 )) backup_received ) details WHERE lbr.last_backup_received=details.last_backup_received AND  lbr.district_id=details.district_id GROUP BY details.district_id) info, send WHERE info.send_id=send.send_id", nativeQuery = true)
	public List<Object[]> findLastBackupReceivedByDistrict();

	/**
	 * @return date of last backup restored by District
	 */
	@Query(value = "SELECT send.uuid,info.district_id,info.last_backup_received FROM (SELECT MAX(details.send_id) AS send_id,details.district_id,details.last_backup_received FROM (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT(MAX(backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 AND r.restored=1)) backup_received GROUP BY name) lbr, (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT((backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 AND r.restored=1 )) backup_received ) details WHERE lbr.last_backup_received=details.last_backup_received AND  lbr.district_id=details.district_id GROUP BY details.district_id) info, send WHERE info.send_id=send.send_id", nativeQuery = true)
	public List<Object[]> findLastBackupRestoredByDistrict();

	/**
	 * @return server and date of last sync by District
	 */
	@Query(value = "SELECT s.uuid,d.district_id,se.name,Date_format(s.start_time, '%d/%m/%Y %H:%i') start_time,Date_format(s.end_time,'%H:%i') end_time,CONCAT(se.name,'\\n',Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i'),'\\n',p.others_names,' ',p.surname) AS server_report FROM sync s,server se,district d,user u,person p WHERE sync_id IN(SELECT Max(sync_id) Sync_id FROM (SELECT sync.sync_id, server.district_id FROM server INNER JOIN sync ON server.server_id = sync.server_id WHERE sync.canceled = 0 AND server.canceled = 0) syncs GROUP BY district_id ) AND s.server_id=se.server_id AND d.district_id=se.district_id AND u.user_id=s.created_by AND p.person_id=u.person_id", nativeQuery = true)
	public List<Object[]> findLastSyncByDistrict();

	/**
	 * @return number of backups received by District on previous month
	 */
	@Query(value = "SELECT IF(ISNULL(parent.name),district.name,CONCAT(parent.name,' / ',district.name)) as name, COUNT(*) exist FROM send INNER JOIN district   ON send.district_id =  district.district_id  LEFT JOIN district AS parent ON district.parent_id=parent.district_id WHERE  send.received = 1 AND send.canceled = 0 AND Year(send.backup_date) = Year( CURRENT_DATE - INTERVAL 1 month) AND Month(send.backup_date) = Month( CURRENT_DATE - INTERVAL 1 month) GROUP BY district.district_id ORDER BY 1 ASC", nativeQuery = true)
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth();

	/**
	 * @return number of backups received by District on this month
	 */
	@Query(value = "SELECT IF(ISNULL(parent.name),district.name,CONCAT(parent.name,' / ',district.name)) as name, COUNT(*) exist FROM send INNER JOIN district   ON send.district_id =  district.district_id  LEFT JOIN district AS parent ON district.parent_id=parent.district_id WHERE  send.received = 1 AND send.canceled = 0 AND Year(send.backup_date) = Year( CURRENT_DATE) AND Month(send.backup_date) = Month( CURRENT_DATE) GROUP BY district.district_id ORDER BY 1 ASC", nativeQuery = true)
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth();

	/**
	 * @return number of backups received on the last 12 months
	 */
	@Query(value = "SELECT received.*,IFNULL(restored.restored,0) restored FROM (SELECT result.received,result.month FROM (SELECT COUNT(DISTINCT(district.district_id)) As received,  CONCAT(MONTHNAME(send.backup_date),' ',YEAR(send.backup_date)) AS month,CONCAT(YEAR(send.backup_date),'', DATE_FORMAT(send.backup_date,'%m')) month_nr FROM send Inner Join district ON send.district_id = district.district_id WHERE send.received=1 AND send.canceled=0  GROUP BY CONCAT( MONTH(send.backup_date) ,' ',YEAR(send.backup_date)) ORDER BY CONCAT(YEAR(send.backup_date),'', DATE_FORMAT(send.backup_date,'%m')) DESC LIMIT 12) result  ORDER BY result.month_nr ASC) received LEFT JOIN (SELECT COUNT(DISTINCT(district.district_id)) As restored,  CONCAT(MONTHNAME(send.backup_date),' ',YEAR(send.backup_date)) AS month FROM send Inner Join district ON send.district_id = district.district_id  Inner Join receive ON send.send_id = receive.send_id WHERE send.received=1  AND receive.restored=1 AND send.canceled=0 AND receive.canceled=0  GROUP BY CONCAT( MONTH(send.backup_date) ,' ',YEAR(send.backup_date)) ORDER BY CONCAT(YEAR(send.backup_date),'', DATE_FORMAT(send.backup_date,'%m')) DESC LIMIT 12) restored ON received.month=restored.month", nativeQuery = true)
	public List<Object[]> findBackupReceivedOnLast12Months();

}
