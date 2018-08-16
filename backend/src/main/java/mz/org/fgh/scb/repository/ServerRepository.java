package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mz.org.fgh.scb.model.entity.Server;

/**
 * @author damasceno.lopes
 *
 */
public interface ServerRepository extends JpaRepository<Server, Long>, JpaSpecificationExecutor<Server> {

	@Query("SELECT s FROM server s JOIN s.district d WHERE s.canceled=0 ORDER BY d.name,s.name ASC")
	List<Server> findAllByOrderByNameAsc();

	Server findByUuid(String uuid);
	
	@Query("SELECT s FROM server s JOIN s.district d WHERE d.district_id=:district_id AND s.canceled=0 ORDER BY d.name,s.name ASC")
	public List<Server> findByDistrictId(@Param("district_id") Long district_id);
	
	@Query("SELECT distinct s FROM server s JOIN s.district d JOIN d.users u WHERE s.canceled=0 AND u.username=:username ORDER BY d.name,s.name ASC")
	public List<Server> findByUserId(@Param("username") String username);
	
	@Query(value = "SELECT s.sync_id,se.server_id,CONCAT(Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i'),'\\n',s.end_items_to_send,' itens por enviar, ',s.end_items_to_receive,' itens por receber','\\n',p.others_names,' ',p.surname) AS server_report, CONCAT(Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i')) as time_sync,end_items_to_send,end_items_to_receive FROM sync s,server se,user u,person p WHERE sync_id IN(SELECT Max(sync_id) Sync_id FROM (SELECT sync.sync_id, server.server_id FROM server INNER JOIN sync ON server.server_id = sync.server_id WHERE sync.canceled = 0 AND server.canceled = 0) syncs GROUP BY server_id ) AND s.server_id=se.server_id AND u.user_id=s.created_by AND p.person_id=u.person_id", nativeQuery = true)
	public List<Object[]> findLastSyncsByServer();
	
	@Query(value = "SELECT synced.*,Ifnull(synced_error.error, 0) AS error FROM (SELECT server.name sname, district.name dname,server.server_id,COUNT(*) AS exist FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE - INTERVAL 7 day) GROUP BY server.server_id) synced LEFT JOIN ( SELECT server.server_id,COUNT(*) AS error FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND sync.sync_error=1 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE - INTERVAL 7 day) GROUP BY server.server_id ) synced_error ON synced.server_id = synced_error.server_id ORDER BY 2,1 ASC  ", nativeQuery = true)
	public List<Object[]> findSyncsOfPreviousWeek();
	
	@Query(value = "SELECT synced.*,Ifnull(synced_error.error, 0) AS error FROM (SELECT server.name sname, district.name dname,server.server_id,COUNT(*) AS exist FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE ) GROUP BY server.server_id) synced LEFT JOIN ( SELECT server.server_id,COUNT(*) AS error FROM sync INNER JOIN server ON sync.server_id = server.server_id INNER JOIN district ON district.district_id = server.district_id WHERE sync.canceled = 0 AND sync.sync_error=1 AND Yearweek(sync.start_time) = Yearweek( CURRENT_DATE ) GROUP BY server.server_id ) synced_error ON synced.server_id = synced_error.server_id ORDER BY 2,1 ASC  ", nativeQuery = true)
	public List<Object[]> findSyncsOfThisWeek();
	
	@Query(value = "SELECT sync.sync_id, server.name sname, district.name dname, sync.end_items_to_send, sync.end_items_to_receive FROM sync Inner Join server ON sync.server_id = server.server_id Inner Join district ON server.district_id = district.district_id WHERE Yearweek(sync.start_time)=Yearweek(current_date - interval 7 day) AND  (sync.end_items_to_send>0 OR sync.end_items_to_receive>0) GROUP BY dname,sname", nativeQuery = true)
	public List<Object[]> findSyncsItemsOfPreviousWeek();

	@Query(value = "SELECT sync.sync_id, server.name sname, district.name dname, sync.end_items_to_send, sync.end_items_to_receive FROM sync Inner Join server ON sync.server_id = server.server_id Inner Join district ON server.district_id = district.district_id WHERE Yearweek(sync.start_time)=Yearweek(current_date) AND  (sync.end_items_to_send>0 OR sync.end_items_to_receive>0) GROUP BY dname,sname", nativeQuery = true)
	public List<Object[]> findSyncsItemsOfThisWeek();
	
	
	
	
}
