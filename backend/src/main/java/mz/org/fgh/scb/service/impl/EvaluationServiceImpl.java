/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.impl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Evaluation;
import mz.org.fgh.scb.repository.EvaluationRepository;
import mz.org.fgh.scb.service.api.EvaluationService;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class EvaluationServiceImpl implements EvaluationService {

	@Autowired
	EvaluationRepository evaluationRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public Page<Evaluation> findAll(Specification<Evaluation> spec, PageRequest pageRequest) {
		return evaluationRepository.findAll(spec, pageRequest);
	}

	@Override
	public Evaluation findByUuid(String uuid) {
		return evaluationRepository.findByUuid(uuid);
	}

	@Override
	public Evaluation save(Evaluation evaluation) {

		if (evaluation.getEvaluation_id() == null) {
			evaluation.setDate_created(new Date());
			evaluation.setDate_updated(new Date());
			logger.info(evaluation.getCreated_by().getUsername() + ", created " + evaluation.toString());
		} else {
			evaluation.setDate_updated(new Date());
			logger.info(evaluation.getUpdated_by().getUsername() + ", updated " + evaluation.toString());
		}
		return evaluationRepository.save(evaluation);
	}

	@Override
	public void delete(Evaluation evaluation) {
		logger.info("Deleted: " + evaluation.toString());
		evaluationRepository.delete(evaluation);
	}

}
