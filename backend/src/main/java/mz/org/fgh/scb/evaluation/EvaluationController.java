/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.evaluation;

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
import mz.org.fgh.scb.exception.ItemNotFoundException;
import mz.org.fgh.scb.filter.PageRequestBuilder;

/**
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "Evaluation" })
public class EvaluationController {

	@Autowired
	private EvaluationServiceImpl evaluationServiceImpl;

	@GetMapping(value = "/v1/evaluations")
	public Page<Evaluation> findEvaluations(
			@RequestParam(value = "fields", required = true) String fields,
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = false) String page, 
			@RequestParam(value = "pageSize", required = false) String pageSize) throws Exception {
		
		EvaluationSpecificationsBuilder builder = new EvaluationSpecificationsBuilder();
		if(page == null || page.isEmpty() || pageSize == null || pageSize.isEmpty()) {
			page = null;
			pageSize = null;
		}
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:like:)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Evaluation> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<Evaluation> pageEvaluation = evaluationServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (page != null) {
				if (Integer.valueOf(page + "") > pageEvaluation.getTotalPages()) {
					throw new Exception();
				}
			}
		}
		
			return pageEvaluation;

	}

	@PostMapping(value = "/v1/evaluations")
	@ResponseBody
	public String createEvaluation(@RequestBody Evaluation evaluation) {
		try {
			evaluationServiceImpl.save(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/v1/evaluations/{uuid}")
	public Evaluation findOneEvaluationByUuid(@PathVariable String uuid){
		Evaluation evaluation=evaluationServiceImpl.findOneByUuid(uuid);
		if (evaluation==null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
		return evaluation;
	}

	@DeleteMapping(value = "/v1/evaluations/{uuid}")
	@ResponseBody
	public String deleteEvaluation(@PathVariable String uuid){
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

	@PutMapping(value = "/v1/evaluations")
	@ResponseBody
	public String updateEvaluation(@RequestBody Evaluation evaluation){
		try {
			evaluationServiceImpl.save(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
