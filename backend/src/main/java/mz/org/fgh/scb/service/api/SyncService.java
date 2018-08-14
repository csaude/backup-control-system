package mz.org.fgh.scb.service.api;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mz.org.fgh.scb.model.entity.Sync;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface SyncService {

	Sync findByUuid(String uuid);

	Sync save(Sync send);

	void delete(Sync send);
	
	Page<Sync> findAll(Pageable pageable);
	
	Page<Sync> findAllByDate(Pageable pageable, Date from, Date until);

	Page<Sync> findByDistrictId(Long district_id, Pageable pageable);

	Page<Sync> findByDistrictId(Long district_id, Pageable pageable, Date from, Date until);
	
	Page<Sync> findByServerId(Long server_id, Pageable pageable);

	Page<Sync> findByServerId(Long server_id, Pageable pageable, Date from, Date until);

	Page<Sync> findByUserId(Pageable pageable, String username);

	Page<Sync> findByUserId(Pageable pageable, Date from, Date until, String username);

}
