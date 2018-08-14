package mz.org.fgh.scb.service.api;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mz.org.fgh.scb.model.entity.Receive;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface ReceiveService {

	Receive findByUuid(String uuid);

	Receive save(Receive receive);

	void delete(Receive receive);

	Page<Receive> findByDistrictId(Long district_id, Pageable pageable);

	Page<Receive> findByDistrictId(Long district_id, Pageable pageable, Date from, Date until);

	Page<Receive> findByUserId(Pageable pageable, String username);

	Page<Receive> findByUserId(Pageable pageable, Date from, Date until, String username);
	
	Page<Receive> findByDate(Pageable pageable, Date from, Date until);

	Receive findBySendId(Long send_id);

	Page<Receive> findAllReceived(Pageable pageable);

}
