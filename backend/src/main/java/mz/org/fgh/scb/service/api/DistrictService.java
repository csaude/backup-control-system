package mz.org.fgh.scb.service.api;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.District;

/**
 * @author damasceno.lopes
 *
 */
public interface DistrictService {

	Page<District> findAll(Specification<District> spec, PageRequest pageRequest);

	List<District> findAllByOrderByNameAsc();

	District findByUuid(String uuid);

	District save(District district);

	Page<District> findAll(String name, boolean canceled, Pageable pageable);

	Page<District> findAllByUser(String name, String username, boolean canceled, Pageable pageable);

	void delete(District district);

	List<Object[]> findLastBackupReceivedByDistrict();

	List<Object[]> findLastBackupRestoredByDistrict();

	List<Object[]> findBackupReceivedByDistrictOnPreviousMonth();

	List<Object[]> findBackupReceivedByDistrictOnThisMonth();

	List<Object[]> findBackupReceivedOnLast12Months();

	List<Object[]> findBackupReceivedByDistrictOnPreviousMonthByUser(String username);

	List<Object[]> findBackupReceivedByDistrictOnThisMonthByUser(String username);
}