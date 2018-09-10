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

import mz.org.fgh.scb.model.entity.Server;
import mz.org.fgh.scb.repository.ServerRepository;
import mz.org.fgh.scb.service.api.ServerService;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class ServerServiceImpl implements ServerService {

	@Autowired
	ServerRepository serverRepository;

	@Autowired
	UserServiceImpl userServiceImpl;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public Server findOneByUuid(String uuid) {
		return serverRepository.findOneByUuid(uuid);
	}

	@Override
	public Server save(Server server) {
		if (server.getServer_id() == null) {
			server.setDate_created(new Date());
			server.setDate_updated(new Date());
			logger.info(server.getCreated_by().getUsername() + ", created " + server.toString());
		} else {
			server.setDate_updated(new Date());
			if (server.isCanceled() == true) {
				server.setDate_canceled(new Date());
				server.setCanceled_by(server.getUpdated_by());
			} else {
				server.setCanceled_reason(null);
			}
			logger.info(server.getUpdated_by().getUsername() + ", updated " + server.toString());
		}
		return serverRepository.save(server);
	}

	@Override
	public void delete(Server server) {
		logger.info("Deleted " + server.toString());
		serverRepository.delete(server);
	}

	@Override
	public Page<Server> findAll(Specification<Server> spec, PageRequest pageRequest) {
		return serverRepository.findAll(spec, pageRequest);
	}

}
