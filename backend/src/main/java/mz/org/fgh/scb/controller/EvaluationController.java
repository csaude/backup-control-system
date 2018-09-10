/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import mz.org.fgh.scb.model.entity.Evaluation;
import mz.org.fgh.scb.service.impl.EvaluationServiceImpl;
import mz.org.fgh.scb.specification.EvaluationSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Evaluations
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = {"Evaluation"})
public class EvaluationController {

	@Autowired
	private EvaluationServiceImpl evaluationServiceImpl;
	
	@GetMapping(value = "/evaluations")
	public Page<Evaluation> findEvaluations(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		EvaluationSpecificationsBuilder builder = new EvaluationSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Evaluation> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(10, page, "+name");
		Page<Evaluation> pageEvaluation = evaluationServiceImpl.findAll(spec, pageRequest);
		if (page > pageEvaluation.getTotalPages()) {
			throw new Exception();
		}
		return pageEvaluation;
	}

	@PostMapping(value = "/evaluation")
	@ResponseBody
	public String createEvaluation(
			@RequestBody Evaluation evaluation) {
		try {
			evaluationServiceImpl.save(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/evaluation/{uuid}")
	public Evaluation findOneEvaluationByUuid(@PathVariable String uuid) throws Exception {
		return evaluationServiceImpl.findOneByUuid(uuid);
	}

	@DeleteMapping(value = "/evaluation/{uuid}")
	@ResponseBody
	public String deleteEvaluation(@PathVariable String uuid) throws Exception {
		Evaluation evaluation = null;
		try {
			evaluation = evaluationServiceImpl.findOneByUuid(uuid);
			evaluationServiceImpl.delete(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@PutMapping(value = "/evaluation")
	@ResponseBody
	public String updateEvaluation(@RequestBody Evaluation evaluation) throws Exception {
		try {
			evaluationServiceImpl.save(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
