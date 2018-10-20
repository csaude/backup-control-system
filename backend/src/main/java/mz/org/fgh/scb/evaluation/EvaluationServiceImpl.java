/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.evaluation;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class EvaluationServiceImpl implements EvaluationService {

	@Autowired
	EvaluationRepository evaluationRepository;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public Page<Evaluation> findAll(Specification<Evaluation> spec, PageRequest pageRequest) {
		return evaluationRepository.findAll(spec, pageRequest);
	}

	@Transactional(readOnly = true)
	@Override
	public Evaluation findOneByUuid(String uuid) {
		return evaluationRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public Evaluation save(Evaluation evaluation) {

		if (evaluation.getEvaluationId() == null) {
			evaluation.setDateCreated(new Date());
			evaluation.setDateUpdated(new Date());
			logger.info(evaluation.getCreatedBy().getUid() + ", created " + evaluation.toString());
		} else {
			evaluation.setDateUpdated(new Date());
			logger.info(evaluation.getUpdatedBy().getUid() + ", updated " + evaluation.toString());
		}
		return evaluationRepository.save(evaluation);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Evaluation evaluation) {
		logger.info("Deleted: " + evaluation.toString());
		evaluationRepository.delete(evaluation);
	}

}
