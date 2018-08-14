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
	
	@Query(value = "SELECT s.sync_id,se.server_id,CONCAT(Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i'),'\\n',s.end_items_to_send,' itens por enviar\\n',s.end_items_to_receive,' itens por receber') AS server_report, CONCAT(Date_format(s.start_time,'%d/%m/%Y %H:%i'),'-',Date_format(s.end_time,'%H:%i')) as time_sync,end_items_to_send,end_items_to_receive FROM sync s,server se WHERE sync_id IN(SELECT Max(sync_id) Sync_id FROM (SELECT sync.sync_id, server.server_id FROM server INNER JOIN sync ON server.server_id = sync.server_id WHERE sync.canceled = 0 AND server.canceled = 0) syncs GROUP BY server_id ) AND s.server_id=se.server_id", nativeQuery = true)
	public List<Object[]> findLastSyncsByServer();

}
