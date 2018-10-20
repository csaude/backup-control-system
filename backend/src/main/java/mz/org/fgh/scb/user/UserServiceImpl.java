/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.user;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mz.org.fgh.scb.person.Person;
import mz.org.fgh.scb.person.PersonServiceImpl;

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

	@Transactional(readOnly = true)
	@Override
	public User findOneByUuid(String uuid) {
		return userRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<User> findAll(Specification<User> spec, PageRequest pageRequest) {
		return userRepository.findAll(spec, pageRequest);
	}

	@Transactional(readOnly = false)
	@Override
	public User save(User user) {
		Person person = new Person();
		if (user.getUserId() == null) {
			user.setDateCreated(new Date());
			user.setDateUpdated(new Date());
			person = user.getPerson();
			person.setCreatedBy(user.getCreatedBy());
			personServiceImpl.save(person);
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			logger.info(user.getCreatedBy().getUid() + ", created User: " + user.toString());
		} else {
			User user_bd = userRepository.findOne(user.getUserId());
			user.setDateUpdated(new Date());
			person = user.getPerson();
			person.setCreatedBy(user.getCreatedBy());
			person.setUpdatedBy(user.getUpdatedBy());
			personServiceImpl.save(person);
			if (user.getPassword() == null) {
				user.setPassword(user_bd.getPassword());
			} else {
				user.setPassword(passwordEncoder.encode(user.getPassword()));
			}
			logger.info(user.getUpdatedBy().getUid() + ", updated User: " + user.toString());
		}
		return userRepository.save(user);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(User user) {
		logger.info("Deleted User: " + user.toString());
		userRepository.delete(user);
	}

	@Transactional(readOnly = true)
	@Override
	public User findOneById(Long id) {
		return userRepository.findOne(id);
	}

	@Transactional(readOnly = false)
	@Override
	public User authenticate(String username) {
		User user = userRepository.findOneByUsername(username);
		user.setLastLogin(new Date());
		userRepository.save(user);
		logger.info(user.toString() + ", Log in");
		return user;
	}
}
