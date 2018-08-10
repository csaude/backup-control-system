package mz.org.fgh.scb.service.api;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mz.org.fgh.scb.model.entity.Send;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface SendService {

	Send findByUuid(String uuid);

	Send save(Send send);

	void delete(Send send);

	Page<Send> findByDistrictId(Long district_id, Pageable pageable);

	Page<Send> findByDistrictId(Long district_id, Pageable pageable, Date from, Date until);

	Page<Send> findByUserId(Pageable pageable, String username);

	Page<Send> findByUserId(Pageable pageable, Date from, Date until, String username);

	Page<Send> findAllNotReceived(Pageable pageable);

}
