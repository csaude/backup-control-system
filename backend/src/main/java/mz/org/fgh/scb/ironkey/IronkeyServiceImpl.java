/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.ironkey;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mz.org.fgh.scb.user.UserServiceImpl;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class IronkeyServiceImpl implements IronkeyService {

	@Autowired
	IronkeyRepository ironkeyRepository;

	@Autowired
	UserServiceImpl userServiceImpl;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public Ironkey findOneByUuid(String uuid) {
		return ironkeyRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public Ironkey save(Ironkey ironkey) {
		if (ironkey.getIronkeyId() == null) {
			ironkey.setDateCreated(new Date());
			ironkey.setDateUpdated(new Date());
			logger.info(ironkey.getCreatedBy().getUid() + ", created " + ironkey.toString());
		} else {
			ironkey.setDateUpdated(new Date());
			logger.info(ironkey.getUpdatedBy().getUid() + ", updated " + ironkey.toString());
		}

		if (ironkey.getDatePurchased() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				ironkey.setDatePurchased(sdf.parse(sdf.format(ironkey.getDatePurchased())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return ironkeyRepository.save(ironkey);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Ironkey ironkey) {
		logger.info("Deleted " + ironkey.toString());
		ironkeyRepository.delete(ironkey);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<Ironkey> findAll(Specification<Ironkey> spec, PageRequest pageRequest) {
		return ironkeyRepository.findAll(spec, pageRequest);
	}

}
