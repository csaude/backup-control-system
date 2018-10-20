/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.person;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Damasceno Lopes
 *
 */
public interface PersonRepository extends JpaRepository<Person, Long> {

	Person findOneByUid(String uuid);

}
