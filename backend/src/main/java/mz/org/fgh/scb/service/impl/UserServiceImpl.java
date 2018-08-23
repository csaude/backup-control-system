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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Person;
import mz.org.fgh.scb.model.entity.User;
import mz.org.fgh.scb.repository.UserRepository;
import mz.org.fgh.scb.service.api.UserService;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepository;

	@Autowired
	private PersonServiceImpl personServiceImpl;

	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(11);

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public User findByUuid(String uuid) {
		return userRepository.findByUuid(uuid);
	}

	@Override
	public Page<User> findAll(Specification<User> spec, PageRequest pageRequest) {
		return userRepository.findAll(spec, pageRequest);
	}

	@Override
	public User findByUsername(String username) {
		return userRepository.findOneByUsername(username);
	}

	@Override
	public User save(User user) {
		Person person = new Person();
		if (user.getUser_id() == null) {
			user.setDate_created(new Date());
			user.setDate_updated(new Date());
			person = user.getPerson();
			person.setCreated_by(user.getCreated_by());
			personServiceImpl.save(person);
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			logger.info(user.getCreated_by().getUsername() + ", created User: " + user.toString());
		} else {
			User user_bd = userRepository.findOne(user.getUser_id());
			user.setDate_updated(new Date());
			person = user.getPerson();
			person.setCreated_by(user.getCreated_by());
			person.setUpdated_by(user.getUpdated_by());
			personServiceImpl.save(person);
			if (user.getPassword() == null) {
				user.setPassword(user_bd.getPassword());
			} else {
				user.setPassword(passwordEncoder.encode(user.getPassword()));
			}
			logger.info(user.getUpdated_by().getUsername() + ", updated User: " + user.toString());
		}
		return userRepository.save(user);
	}

	@Override
	public void delete(User user) {
		logger.info("Deleted User: " + user.toString());
		userRepository.delete(user);
	}

	public User findById(Long id) {
		return userRepository.findOne(id);
	}

	public User authenticate(String username) {
		User user = userRepository.findOneByUsername(username);
		user.setLast_login(new Date());
		userRepository.save(user);
		logger.info(user.toString() + ", Log in");
		return user;
	}
}
