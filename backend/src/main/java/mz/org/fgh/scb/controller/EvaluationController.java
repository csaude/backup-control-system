package mz.org.fgh.scb.controller;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.model.entity.Evaluation;
import mz.org.fgh.scb.service.impl.EvaluationServiceImpl;
import mz.org.fgh.scb.specification.EvaluationSpecificationsBuilder;

/**
 * @author damasceno.lopes
 *
 */
@RestController
@RequestMapping("api")
public class EvaluationController {

	@Autowired
	private EvaluationServiceImpl evaluationServiceImpl;

	@RequestMapping(value = "/evaluations", method = RequestMethod.GET)
	public List<Evaluation> findAll() {
		return evaluationServiceImpl.findAllByOrderByNameAsc();
	}
	
	@RequestMapping(value = "/evaluations/get", method = RequestMethod.GET)
	public Page<Evaluation> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
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

	@RequestMapping(value = "/evaluations", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public String create(
			@RequestBody Evaluation evaluation) {
		try {
			evaluationServiceImpl.save(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@RequestMapping(value = "/evaluations/{uuid}", method = RequestMethod.GET)
	public Evaluation getEvaluation(@PathVariable String uuid) throws Exception {
		return evaluationServiceImpl.findByUuid(uuid);
	}

	@RequestMapping(value = "/evaluations/{uuid}", method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public String deleteEvaluation(@PathVariable String uuid) throws Exception {
		Evaluation evaluation = null;
		try {
			evaluation = evaluationServiceImpl.findByUuid(uuid);
			evaluationServiceImpl.delete(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@RequestMapping(value = "/evaluations", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public String update(@RequestBody Evaluation evaluation) throws Exception {
		try {
			evaluationServiceImpl.save(evaluation);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
