package mz.org.fgh.scb.service.api;

import mz.org.fgh.scb.model.entity.Person;

public interface PersonService {

	Person save(Person person);

	void delete(Person person);

}
