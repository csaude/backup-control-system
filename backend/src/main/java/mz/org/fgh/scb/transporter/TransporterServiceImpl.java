/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.transporter;

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
public class TransporterServiceImpl implements TransporterService {

	@Autowired
	TransporterRepository transporterRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public Page<Transporter> findAll(Specification<Transporter> spec, PageRequest pageRequest) {
		return transporterRepository.findAll(spec, pageRequest);
	}

	@Transactional(readOnly = true)
	@Override
	public Transporter findOneByUuid(String uuid) {
		return transporterRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public Transporter save(Transporter transporter) {
		if (transporter.getTransporterId() == null) {
			transporter.setDateCreated(new Date());
			transporter.setDateUpdated(new Date());
			logger.info(transporter.getCreatedBy().getUid() + ", created " + transporter.toString());
		} else {
			transporter.setDateUpdated(new Date());
			if (transporter.isCanceled() == true) {
				transporter.setDateCanceled(new Date());
				transporter.setCanceledBy(transporter.getUpdatedBy());
			} else {
				transporter.setCanceledReason(null);
			}
			logger.info(transporter.getUpdatedBy().getUid() + ", updated " + transporter.toString());
		}
		return transporterRepository.save(transporter);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Transporter transporter) {
		logger.info("Deleted: " + transporter.toString());
		transporterRepository.delete(transporter);
	}
}
