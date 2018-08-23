/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import mz.org.fgh.scb.model.entity.Person;

/**
 * Defines the services api of Persons
 * 
 * @author Damasceno Lopes
 *
 */
public interface PersonService {

	/**
	 * Saves the person and return the Person Saved
	 * 
	 * @param person the Person
	 * @return the Person Saved
	 */
	Person save(Person person);

	/**
	 * Deletes the Person
	 * 
	 * @param person the Person
	 */
	void delete(Person person);

}
