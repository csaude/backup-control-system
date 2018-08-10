package mz.org.fgh.scb.service.impl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Person;
import mz.org.fgh.scb.repository.PersonRepository;
import mz.org.fgh.scb.service.api.PersonService;

/**
 * @author damasceno.lopes
 *
 */
@Service
public class PersonServiceImpl implements PersonService {

	@Autowired
	PersonRepository personRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public Person save(Person person) {
		if (person.getPerson_id() == null) {
			person.setDate_created(new Date());
			person.setDate_updated(new Date());
			logger.info(person.getCreated_by().getUsername() + ", created Person: " + person.toString());
		} else {
			person.setDate_updated(new Date());

			Person person_bd = personRepository.findOne(person.getPerson_id());
			person.setDate_created(person_bd.getDate_created());
			person.setUuid(person_bd.getUuid());

			logger.info(person.getUpdated_by().getUsername() + ", updated Person: " + person.toString());
		}
		return personRepository.save(person);
	}

	@Override
	public void delete(Person person) {
		logger.info("Deleted Person: " + person.toString());
		personRepository.delete(person);
	}

}
