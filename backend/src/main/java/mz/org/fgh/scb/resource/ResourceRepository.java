/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.resource;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mz.org.fgh.scb.district.District;

/**
 * @author Damasceno Lopes
 *
 */
public interface ResourceRepository extends JpaRepository<District, Long> {

	/* Native Queries for complex data extraction */
	@Query(value = "SELECT districts.*, receiveds.*,restoreds.*, syncs.* FROM (SELECT district.district_id FROM district ) districts LEFT JOIN (SELECT send.uuid AS received_uuid,info.district_id AS received_district_id,info.last_backup_received FROM (SELECT  MAX(details.send_id) AS send_id,details.district_id,details.last_backup_received FROM (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT(MAX(backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 )) backup_received GROUP BY name) lbr, (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT((backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 )) backup_received ) details WHERE lbr.last_backup_received=details.last_backup_received AND  lbr.district_id=details.district_id GROUP BY details.district_id) info, send WHERE info.send_id=send.send_id) receiveds ON districts.district_id=receiveds.received_district_id LEFT JOIN (SELECT send.uuid AS restored_uuid,info.district_id AS restored_district_id,info.last_backup_received AS last_backup_restored FROM (SELECT MAX(details.send_id) AS send_id,details.district_id,details.last_backup_received FROM (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT(MAX(backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 AND r.restored=1)) backup_received GROUP BY name) lbr, (SELECT  send_id,name AS district_name,district_id,DATE_FORMAT((backup_date), '%d/%m/%Y') AS last_backup_received FROM (SELECT s.send_id,d.name,s.district_id,s.backup_date,r.date_restored FROM send s,district d,receive r WHERE received=1 AND s.district_id=d.district_id AND s.canceled=0 AND r.send_id=s.send_id AND s.send_id IN(SELECT  r.send_id FROM receive r WHERE r.canceled=0 AND r.restored=1 )) backup_received ) details WHERE lbr.last_backup_received=details.last_backup_received AND  lbr.district_id=details.district_id GROUP BY details.district_id) info, send WHERE info.send_id=send.send_id) restoreds ON districts.district_id=restoreds.restored_district_id LEFT JOIN (SELECT s.uuid AS sync_uuid,d.district_id AS sync_district_id,se.name AS server_name,Date_format(s.start_time, '%d/%m/%Y %H:%i') start_time,Date_format(s.end_time,'%H:%i') end_time,CONCAT(se.name,'\n',Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i'),'\n',p.others_names,' ',p.surname) AS server_report FROM sync s,server se,district d,user u,person p WHERE sync_id IN(SELECT Max(sync_id) Sync_id FROM (SELECT sync.sync_id, server.district_id FROM server INNER JOIN sync ON server.server_id = sync.server_id WHERE sync.canceled = 0 AND server.canceled = 0 AND sync.end_time IS NOT NULL) syncs GROUP BY district_id ) AND s.server_id=se.server_id AND d.district_id=se.district_id AND u.user_id=s.created_by AND p.person_id=u.person_id) syncs ON districts.district_id=syncs.sync_district_id", nativeQuery = true)
	public List<Object[]> findDistrictsInfo();

	@Query(value = "SELECT IF(ISNULL(parent.name),district.name,CONCAT(parent.name,' / ',district.name)) as name, COUNT(*) exist FROM send INNER JOIN district   ON send.district_id =  district.district_id  LEFT JOIN district AS parent ON district.parent_id=parent.district_id WHERE  send.received = 1 AND send.canceled = 0 AND Year(send.backup_date) = Year( CURRENT_DATE - INTERVAL 1 month) AND Month(send.backup_date) = Month( CURRENT_DATE - INTERVAL 1 month) GROUP BY district.district_id ORDER BY 1 ASC", nativeQuery = true)
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth();

	@Query(value = "SELECT IF(ISNULL(parent.name),district.name,CONCAT(parent.name,' / ',district.name)) as name, COUNT(*) exist FROM send INNER JOIN district   ON send.district_id =  district.district_id  LEFT JOIN district AS parent ON district.parent_id=parent.district_id WHERE  send.received = 1 AND send.canceled = 0 AND Year(send.backup_date) = Year( CURRENT_DATE) AND Month(send.backup_date) = Month( CURRENT_DATE) GROUP BY district.district_id ORDER BY 1 ASC", nativeQuery = true)
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth();

	@Query(value = "SELECT received.*,IFNULL(restored.restored,0) restored FROM (SELECT result.received,result.month FROM (SELECT COUNT(DISTINCT(district.district_id)) As received,  CONCAT(MONTHNAME(send.backup_date),' ',YEAR(send.backup_date)) AS month,CONCAT(YEAR(send.backup_date),'', DATE_FORMAT(send.backup_date,'%m')) month_nr FROM send Inner Join district ON send.district_id = district.district_id WHERE send.received=1 AND send.canceled=0  GROUP BY CONCAT( MONTH(send.backup_date) ,' ',YEAR(send.backup_date)) ORDER BY CONCAT(YEAR(send.backup_date),'', DATE_FORMAT(send.backup_date,'%m')) DESC LIMIT 12) result  ORDER BY result.month_nr ASC) received LEFT JOIN (SELECT COUNT(DISTINCT(district.district_id)) As restored,  CONCAT(MONTHNAME(send.backup_date),' ',YEAR(send.backup_date)) AS month FROM send Inner Join district ON send.district_id = district.district_id  Inner Join receive ON send.send_id = receive.send_id WHERE send.received=1  AND receive.restored=1 AND send.canceled=0 AND receive.canceled=0  GROUP BY CONCAT( MONTH(send.backup_date) ,' ',YEAR(send.backup_date)) ORDER BY CONCAT(YEAR(send.backup_date),'', DATE_FORMAT(send.backup_date,'%m')) DESC LIMIT 12) restored ON received.month=restored.month", nativeQuery = true)
	public List<Object[]> findBackupReceivedOnLast12Months();

	@Query(value = "SELECT s.uuid,se.server_id,CONCAT(Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i'),'\\n',s.end_items_to_send,' itens por enviar, ',s.end_items_to_receive,' itens por receber','\\n',p.others_names,' ',p.surname) AS server_report, CONCAT(Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i')) as time_sync,end_items_to_send,end_items_to_receive FROM sync s,server se,user u,person p WHERE sync_id IN(SELECT Max(sync_id) Sync_id FROM (SELECT sync.sync_id, server.server_id FROM server INNER JOIN sync ON server.server_id = sync.server_id WHERE sync.canceled = 0 AND server.canceled = 0) syncs GROUP BY server_id ) AND s.server_id=se.server_id AND u.user_id=s.created_by AND p.person_id=u.person_id", nativeQuery = true)
	public List<Object[]> findLastSyncByServer();

	@Query(value = "SELECT synced.*,Ifnull(synced_error.error, 0) AS error FROM (SELECT server.name sname, district.name dname,server.server_id,COUNT(*) AS exist FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE - INTERVAL 7 day) GROUP BY server.server_id) synced LEFT JOIN ( SELECT server.server_id,COUNT(*) AS error FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND sync.sync_error=1 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE - INTERVAL 7 day) GROUP BY server.server_id ) synced_error ON synced.server_id = synced_error.server_id ORDER BY 2,1 ASC  ", nativeQuery = true)
	public List<Object[]> findSyncsOfPreviousWeek();

	@Query(value = "SELECT synced.*,Ifnull(synced_error.error, 0) AS error FROM (SELECT server.name sname, district.name dname,server.server_id,COUNT(*) AS exist FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE ) GROUP BY server.server_id) synced LEFT JOIN ( SELECT server.server_id,COUNT(*) AS error FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND sync.sync_error=1 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE ) GROUP BY server.server_id ) synced_error ON synced.server_id = synced_error.server_id ORDER BY 2,1 ASC  ", nativeQuery = true)
	public List<Object[]> findSyncsOfThisWeek();

	@Query(value = "SELECT sync.sync_id, server.name sname, district.name dname, sync.end_items_to_send, sync.end_items_to_receive FROM sync Inner Join server ON sync.server_id = server.server_id Inner Join district ON server.district_id = district.district_id WHERE Yearweek(sync.start_time)=Yearweek(current_date - interval 7 day) AND  (sync.end_items_to_send>0 OR sync.end_items_to_receive>0) GROUP BY dname,sname", nativeQuery = true)
	public List<Object[]> findSyncsRemainingItemsOfPreviousWeek();

	@Query(value = "SELECT sync.sync_id, server.name sname, district.name dname, sync.end_items_to_send, sync.end_items_to_receive FROM sync Inner Join server ON sync.server_id = server.server_id Inner Join district ON server.district_id = district.district_id WHERE Yearweek(sync.start_time)=Yearweek(current_date) AND  (sync.end_items_to_send>0 OR sync.end_items_to_receive>0) GROUP BY dname,sname", nativeQuery = true)
	public List<Object[]> findSyncsRemainingItemsOfThisWeek();

	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ud.district_id=:district_id AND ua.authority_id IN (3,6)))) AS person", nativeQuery = true)
	public List<String> findUsersForReceiveNotification(@Param("district_id") Long district_id);

	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ua.authority_id IN(1,5) OR (ud.district_id=:district_id AND ua.authority_id IN (3,6))))) AS person", nativeQuery = true)
	public List<String> findUsersForSendNotification(@Param("district_id") Long district_id);

	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ua.authority_id IN(1,5) OR (ud.district_id=:district_id AND ua.authority_id IN (3,6))))) AS person", nativeQuery = true)
	public List<String> findUsersForSyncNotification(@Param("district_id") Long district_id);

	@Query("SELECT COUNT(*) FROM sync s WHERE s.endTime=null AND s.canceled=0 AND DATE(s.startTime)=CURDATE()")
	public int findSyncsInProgress();

	@Query("SELECT COUNT(distinct s) FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u  WHERE s.endTime=null AND s.canceled=0 AND date(s.startTime)=CURDATE() AND u.username=:username")
	public int findSyncsInProgressByUser(@Param("username") String username);

	@Query("SELECT COUNT(*) FROM send s WHERE s.received=0 AND s.canceled=0")
	public int findNumberOfAllBackupsNotReceived();

}
