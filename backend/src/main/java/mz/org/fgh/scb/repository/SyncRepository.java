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
 * @author damasceno.lopes
 *
 */
public interface SyncRepository extends JpaRepository<Sync, Long> {

	Sync findByUuid(String uuid); 
	
	/* JPQL */
	@Query("SELECT s FROM sync s WHERE s.canceled=0 ORDER BY s.start_time DESC")
	public Page<Sync> findAll(Pageable pageable);
	
	@Query("SELECT s FROM sync s WHERE s.canceled=0 AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findAllByDate(Pageable pageable,@Param("from") Date from, @Param("until") Date until);
	
	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d WHERE d.district_id=:district_id AND s.canceled=0 ORDER BY s.start_time DESC")
	public Page<Sync> findByDistrictId(@Param("district_id") Long district_id, Pageable pageable);

	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d WHERE d.district_id=:district_id AND s.canceled=0 AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findByDistrictId(@Param("district_id") Long district_id, Pageable pageable,@Param("from") Date from, @Param("until") Date until);

	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u WHERE s.canceled=0 AND u.username=:username ORDER BY s.start_time DESC")
	public Page<Sync> findByUserId(Pageable pageable, @Param("username") String username);

	@Query("SELECT distinct s FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u WHERE s.canceled=0 AND u.username=:username AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findByUserId(Pageable pageable, @Param("from") Date from, @Param("until") Date until, @Param("username") String username);
	
	@Query("SELECT s FROM sync s JOIN s.server se WHERE se.server_id=:server_id AND s.canceled=0 ORDER BY s.start_time DESC")
	public Page<Sync> findByServerId(@Param("server_id") Long server_id,Pageable pageable);
	
	@Query("SELECT s FROM sync s JOIN s.server se WHERE se.server_id=:server_id AND s.canceled=0 AND (s.start_time BETWEEN :from AND :until ) ORDER BY s.start_time DESC")
	public Page<Sync> findByServerId(@Param("server_id") Long server_id,Pageable pageable, @Param("from") Date from, @Param("until") Date until);

	/* Native Queries */
	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ua.authority_id IN(1,5) OR (ud.district_id=:district_id AND ua.authority_id IN (3,6))))) AS person", nativeQuery = true)
	public List<String> findUsersForNotification(@Param("district_id") Long district_id);
	
	@Query("SELECT COUNT(*) FROM sync s WHERE s.end_time=null AND s.canceled=0 AND DATE(s.start_time)=CURDATE()")
	public int findInProgress();
	
	@Query("SELECT COUNT(distinct s) FROM sync s JOIN s.server se JOIN se.district d JOIN d.users u  WHERE s.end_time=null AND s.canceled=0 AND date(s.start_time)=CURDATE() AND u.username=:username")
	public int findInProgressByUser(@Param("username") String username);

}
