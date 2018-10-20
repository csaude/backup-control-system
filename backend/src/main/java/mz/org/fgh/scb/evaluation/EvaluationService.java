/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.evaluation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes
 *
 */
public interface EvaluationService {

	Evaluation save(Evaluation evaluation);

	void delete(Evaluation evaluation);

	Evaluation findOneByUuid(String uuid);

	Page<Evaluation> findAll(Specification<Evaluation> spec, PageRequest pageRequest);

}
