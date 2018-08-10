package mz.org.fgh.scb.service.impl;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.District;
import mz.org.fgh.scb.repository.DistrictRepository;
import mz.org.fgh.scb.service.api.DistrictService;

/**
 * @author damasceno.lopes
 *
 */
@Service
public class DistrictServiceImpl implements DistrictService {

	@Autowired
	DistrictRepository districtRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public List<District> findAllByOrderByNameAsc() {
		return districtRepository.findAllByOrderByNameAsc();
	}

	@Override
	public District findByUuid(String uuid) {
		return districtRepository.findByUuid(uuid);
	}

	@Override
	public Page<District> findAll(Specification<District> spec, PageRequest pageRequest) {
		return districtRepository.findAll(spec, pageRequest);
	}

	@Override
	public District save(District district) {

		if (district.getDistrict_id() == null) {
			district.setDate_created(new Date());
			district.setDate_updated(new Date());
			logger.info(district.getCreated_by().getUsername() + ", created District: " + district.toString());
		} else {
			district.setDate_updated(new Date());
			logger.info(district.getUpdated_by().getUsername() + ", updated District: " + district.toString());
		}
		return districtRepository.save(district);
	}

	@Override
	public void delete(District district) {
		logger.info("Deleted District: " + district.toString());
		districtRepository.delete(district);
	}

	@Override
	public Page<District> findAll(String name, boolean canceled, Pageable pageRequest) {
		return this.districtRepository.findAll(name, canceled, pageRequest);
	}

	@Override
	public Page<District> findAllByUser(String name, String username, boolean canceled, Pageable pageRequest) {
		return this.districtRepository.findAllByUser(name, username, canceled, pageRequest);
	}

	@Override
	public List<Object[]> findLastBackupReceivedByDistrict() {
		return districtRepository.findLastBackupReceivedByDistrict();
	}

	@Override
	public List<Object[]> findLastBackupRestoredByDistrict() {
		return districtRepository.findLastBackupRestoredByDistrict();
	}

	@Override
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth() {
		return districtRepository.findBackupReceivedByDistrictOnPreviousMonth();
	}

	@Override
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth() {
		return districtRepository.findBackupReceivedByDistrictOnThisMonth();
	}

	@Override
	public List<Object[]> findBackupReceivedOnLast12Months() {
		return districtRepository.findBackupReceivedOnLast12Months();
	}

	@Override
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonthByUser(String username) {
		return districtRepository.findBackupReceivedByDistrictOnPreviousMonthByUser(username);
	}

	@Override
	public List<Object[]> findBackupReceivedByDistrictOnThisMonthByUser(String username) {
		return districtRepository.findBackupReceivedByDistrictOnThisMonthByUser(username);
	}
}
