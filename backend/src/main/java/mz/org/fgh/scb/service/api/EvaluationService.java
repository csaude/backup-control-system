/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Evaluation;

/**
 * Defines the services api of Evaluations
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface EvaluationService {

	/**
	 * Saves the Evaluation and return the Evaluation Saved
	 * 
	 * @param evaluation the Evaluation
	 * @return the Evaluation Saved
	 */
	Evaluation save(Evaluation evaluation);

	/**
	 * Deletes the Evaluation
	 * 
	 * @param evaluation the Evaluation
	 */
	void delete(Evaluation evaluation);

	/**
	 * Returns the Evaluation with the given uuid
	 * 
	 * @param uuid the uuid
	 * @return the Evaluation with the given uuid
	 */
	Evaluation findOneByUuid(String uuid);

	/**
	 * Returns all Evaluations paginated
	 * 
	 * @param spec        the Evaluation Spcification
	 * @param pageRequest the PageRequest
	 * @return all Evaluations paginated
	 */
	Page<Evaluation> findAll(Specification<Evaluation> spec, PageRequest pageRequest);

}
