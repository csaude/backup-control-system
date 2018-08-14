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
 * @author damasceno.lopes
 *
 */
public interface ReceiveRepository extends JpaRepository<Receive, Long> {

	Receive findByUuid(String uuid);

	/* JPQL */
	@Query("SELECT r FROM receive r JOIN r.send s WHERE s.send_id=:send_id AND s.canceled=0 AND r.canceled=0")
	public Receive findBySendId(@Param("send_id") Long send_id);

	@Query("SELECT r FROM receive r JOIN r.send s JOIN s.district d WHERE d.district_id=:district_id AND s.canceled=0 AND r.canceled=0 ORDER BY s.backup_date DESC")
	public Page<Receive> findByDistrictId(@Param("district_id") Long district_id, Pageable pageable);

	@Query("SELECT r FROM receive r JOIN r.send s JOIN s.district d WHERE d.district_id=:district_id AND s.canceled=0 AND r.canceled=0 AND (s.backup_date BETWEEN :from AND :until ) ORDER BY s.backup_date DESC")
	public Page<Receive> findByDistrictId(@Param("district_id") Long district_id, Pageable pageable,@Param("from") Date from, @Param("until") Date until);

	@Query("SELECT distinct r FROM receive r JOIN r.send s JOIN s.district d JOIN d.users u WHERE u.username=:username AND s.canceled=0 AND r.canceled=0 ORDER BY s.backup_date DESC")
	public Page<Receive> findByUserId(Pageable pageable, @Param("username") String username);

	@Query("SELECT distinct r FROM receive r JOIN r.send s JOIN s.district d JOIN d.users u WHERE u.username=:username AND s.canceled=0 AND r.canceled=0 AND (s.backup_date BETWEEN :from AND :until ) ORDER BY s.backup_date DESC")
	public Page<Receive> findByUserId(Pageable pageable, @Param("from") Date from, @Param("until") Date until,@Param("username") String username);
	
	@Query("SELECT distinct r FROM receive r JOIN r.send s JOIN s.district d WHERE s.canceled=0 AND r.canceled=0 AND (s.backup_date BETWEEN :from AND :until ) ORDER BY s.backup_date DESC")
	public Page<Receive> findByDate(Pageable pageable, @Param("from") Date from, @Param("until") Date until);

	@Query("SELECT r FROM receive r JOIN r.send s WHERE s.canceled=0 AND r.canceled=0 ORDER BY s.backup_date DESC")
	public Page<Receive> findAllReceived(Pageable pageable);

	/* Native Queries */
	@Query(value = "SELECT DISTINCT(email) FROM (SELECT p.*  FROM  user u, person p WHERE u.person_id=p.person_id AND u.user_id!='admin'  AND u.notification=true AND u.enabled=true AND p.email REGEXP '^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$'  AND u.user_id IN (SELECT u.user_id FROM user u, user_authority ua,user_district ud WHERE u.user_id=ua.user_id AND u.user_id=ud.user_id AND (ud.district_id=:district_id AND ua.authority_id IN (3,6)))) AS person", nativeQuery = true)
	public List<String> findUsersForNotification(@Param("district_id") Long district_id);

}
