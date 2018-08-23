/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Ironkey;

/**
 * Defines the functionality for persisting Ironkeys
 * 
 * @author Damasceno Lopes
 *
 */
public interface IronkeyRepository extends JpaRepository<Ironkey, Long>, JpaSpecificationExecutor<Ironkey> {

	/**
	 * Returns the Ironkey with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Ironkey with the given uuid
	 */
	Ironkey findByUuid(String uuid);

	/**
	 * Returns all Ironkeys
	 * 
	 * @return all Ironkeys
	 */
	List<Ironkey> findAllByOrderBySerialAsc();

}
