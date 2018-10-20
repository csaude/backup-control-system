/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.person;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class PersonServiceImpl implements PersonService {

	@Autowired
	PersonRepository personRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = false)
	@Override
	public Person save(Person person) {
		if (person.getPersonId() == null) {
			person.setDateCreated(new Date());
			person.setDateUpdated(new Date());
			logger.info(person.getCreatedBy().getUid() + ", created Person: " + person.toString());
		} else {
			person.setDateUpdated(new Date());
			Person person_bd = personRepository.findOne(person.getPersonId());
			person.setDateCreated(person_bd.getDateCreated());
			person.setUid(person_bd.getUid());
			logger.info(person.getUpdatedBy().getUid() + ", updated Person: " + person.toString());
		}
		return personRepository.save(person);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Person person) {
		logger.info("Deleted Person: " + person.toString());
		personRepository.delete(person);
	}

}
