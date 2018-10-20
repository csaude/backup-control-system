/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.district;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class DistrictServiceImpl implements DistrictService {

	@Autowired
	DistrictRepository districtRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public District findOneByUuid(String uuid) {
		return districtRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public District save(District district) {

		if (district.getDistrictId() == null) {
			district.setDateCreated(new Date());
			district.setDateUpdated(new Date());
			logger.info(district.getCreatedBy().getUid() + ", created District: " + district.toString());
		} else {
			district.setDateUpdated(new Date());
			logger.info(district.getUpdatedBy().getUid() + ", updated District: " + district.toString());
		}
		return districtRepository.save(district);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(District district) {
		logger.info("Deleted District: " + district.toString());
		districtRepository.delete(district);
	}
	
	@Transactional(readOnly = true)
	@Override
	public Page<District> findAll(Specification<District> spec, PageRequest pageRequest) {
		return districtRepository.findAll(spec, pageRequest);
	}
}
