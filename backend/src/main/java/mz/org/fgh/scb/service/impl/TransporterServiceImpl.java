/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.impl;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Transporter;
import mz.org.fgh.scb.repository.TransporterRepository;
import mz.org.fgh.scb.service.api.TransporterService;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class TransporterServiceImpl implements TransporterService {

	@Autowired
	TransporterRepository transporterRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public List<Transporter> findAllByOrderByNameAsc() {
		return transporterRepository.findAllByOrderByNameAsc();
	}

	@Override
	public Page<Transporter> findAll(Specification<Transporter> spec, PageRequest pageRequest) {
		return transporterRepository.findAll(spec, pageRequest);
	}

	@Override
	public Transporter findByUuid(String uuid) {
		return transporterRepository.findByUuid(uuid);
	}

	@Override
	public Transporter save(Transporter transporter) {
		if (transporter.getTransporter_id() == null) {
			transporter.setDate_created(new Date());
			transporter.setDate_updated(new Date());
			logger.info(transporter.getCreated_by().getUsername() + ", created " + transporter.toString());
		} else {
			transporter.setDate_updated(new Date());
			if (transporter.isCanceled() == true) {
				transporter.setDate_canceled(new Date());
				transporter.setCanceled_by(transporter.getUpdated_by());
			} else {
				transporter.setCanceled_reason(null);
			}
			logger.info(transporter.getUpdated_by().getUsername() + ", updated " + transporter.toString());
		}
		return transporterRepository.save(transporter);
	}

	@Override
	public void delete(Transporter transporter) {
		logger.info("Deleted: " + transporter.toString());
		transporterRepository.delete(transporter);
	}
}
