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
import mz.org.fgh.scb.exception.SearchControllerException;
import mz.org.fgh.scb.model.entity.Transporter;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.TransporterServiceImpl;
import mz.org.fgh.scb.specification.TransporterSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Transporters
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = {"Transporter"})
public class TransporterController {

	@Autowired
	private TransporterServiceImpl transporterServiceImpl;

	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return Send records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/transporters")
	public Page<Transporter> findTransporters(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = false) String pageNumber, @RequestParam(value = "pageSize", required = false) String pageSize) throws Exception {
		TransporterSpecificationsBuilder builder = new TransporterSpecificationsBuilder();
		if (pageNumber != null) {
			if (pageNumber.isEmpty()) {
				pageNumber = null;
			}
		}
		if (pageSize != null) {
			if (pageSize.isEmpty()) {
				pageSize = null;
			}
		}
		Pattern pattern = Pattern.compile("(\\w+?)(=eq:|=like:)(\\w+?),");
		Matcher matcher = pattern.matcher(filterCriteria + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Transporter> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, sortingCriteria);
		Page<Transporter> pageTransporter = transporterServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
			if (pageNumber != null) {
				if (Integer.valueOf(pageNumber + "") > pageTransporter.getTotalPages()) {
					throw new SearchControllerException("Cant find any data with this parameters, try again or contact the System Administrator.");
				}
			}
		}
		return pageTransporter;
	}

	/**
	 * @param transporter the Transporter
	 * @return the Transporter
	 */
	@PostMapping(value = "/transporter")
	@ResponseBody
	public String createTransporter(@RequestBody Transporter transporter) {

		try {
			transporterServiceImpl.save(transporter);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param uuid the Transporter uuid
	 * @return the Transporter with given uuuid
	 * @throws Exception
	 */
	@GetMapping(value = "/transporter/{uuid}")
	public Transporter findOneTransporterByUuid(@PathVariable String uuid) throws Exception {
		return transporterServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param uuid the Transporter uuid
	 * @return Success or error
	 * @throws Exception if any error occurred
	 */
	@DeleteMapping(value = "/transporter/{uuid}")
	@ResponseBody
	public String deleteTransporter(@PathVariable String uuid) throws Exception {
		Transporter transporter = null;
		try {
			transporter = transporterServiceImpl.findOneByUuid(uuid);
			transporterServiceImpl.delete(transporter);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param transporter the Transporter
	 * @return Success or error
	 * @throws Exception if any error occurred
	 */
	@PutMapping(value = "/transporter")
	@ResponseBody
	public String updateTransporter(@RequestBody Transporter transporter) throws Exception {
		try {
			transporterServiceImpl.save(transporter);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

}
