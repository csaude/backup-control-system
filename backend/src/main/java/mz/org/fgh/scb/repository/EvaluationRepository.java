/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Evaluation;

/**
 * Defines the functionality for persisting Evaluations
 * 
 * @author Damasceno Lopes
 *
 */
public interface EvaluationRepository extends JpaRepository<Evaluation, Long>, JpaSpecificationExecutor<Evaluation> {

	/**
	 * Returns the Evaluation with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Evaluation with the given uuid
	 */
	Evaluation findByUuid(String uuid);

	/**
	 * Returns all Evaluations
	 * 
	 * @return all Evaluations
	 */
	List<Evaluation> findAllByOrderByNameAsc();

}
