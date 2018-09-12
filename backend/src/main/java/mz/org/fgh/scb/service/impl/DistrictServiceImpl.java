/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.impl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.District;
import mz.org.fgh.scb.repository.DistrictRepository;
import mz.org.fgh.scb.service.api.DistrictService;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Service
public class DistrictServiceImpl implements DistrictService {

	@Autowired
	DistrictRepository districtRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public District findOneByUuid(String uuid) {
		return districtRepository.findOneByUuid(uuid);
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
	public Page<District> findAll(Specification<District> spec, PageRequest pageRequest) {
		return districtRepository.findAll(spec, pageRequest);
	}
}
