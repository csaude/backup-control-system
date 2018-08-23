/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Ironkey;
import mz.org.fgh.scb.repository.IronkeyRepository;
import mz.org.fgh.scb.service.api.IronkeyService;

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

	@Override
	public List<Ironkey> findAllByOrderBySerialAsc() {
		return ironkeyRepository.findAllByOrderBySerialAsc();
	}

	@Override
	public Ironkey findByUuid(String uuid) {
		return ironkeyRepository.findByUuid(uuid);
	}

	@Override
	public Ironkey save(Ironkey ironkey) {
		if (ironkey.getIronkey_id() == null) {
			ironkey.setDate_created(new Date());
			ironkey.setDate_updated(new Date());
			logger.info(ironkey.getCreated_by().getUsername() + ", created " + ironkey.toString());
		} else {
			ironkey.setDate_updated(new Date());
			logger.info(ironkey.getUpdated_by().getUsername() + ", updated " + ironkey.toString());
		}

		if (ironkey.getDate_purchased() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				ironkey.setDate_purchased(sdf.parse(sdf.format(ironkey.getDate_purchased())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return ironkeyRepository.save(ironkey);
	}

	@Override
	public void delete(Ironkey ironkey) {
		logger.info("Deleted " + ironkey.toString());
		ironkeyRepository.delete(ironkey);
	}

	@Override
	public Page<Ironkey> findAll(Specification<Ironkey> spec, PageRequest pageRequest) {
		return ironkeyRepository.findAll(spec, pageRequest);
	}

}
