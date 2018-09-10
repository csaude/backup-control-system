/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mz.org.fgh.scb.model.entity.Person;

/**
 * Defines the functionality for persisting Persons
 * 
 * @author Damasceno Lopes
 *
 */
public interface PersonRepository extends JpaRepository<Person, Long> {

	/**
	 * Returns the Person with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Person with the given uuid
	 */
	Person findOneByUuid(String uuid);

}
