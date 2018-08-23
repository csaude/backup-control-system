/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
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

import mz.org.fgh.scb.model.entity.Transporter;
import mz.org.fgh.scb.service.impl.TransporterServiceImpl;
import mz.org.fgh.scb.specification.TransporterSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Transporters
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class TransporterController {

	@Autowired
	private TransporterServiceImpl transporterServiceImpl;

	@RequestMapping(value = "/transporters", method = RequestMethod.GET)
	public List<Transporter> findAll() {
		return transporterServiceImpl.findAllByOrderByNameAsc();
	}

	@RequestMapping(value = "/transporters/get", method = RequestMethod.GET)
	public Page<Transporter> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		TransporterSpecificationsBuilder builder = new TransporterSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Transporter> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(10, page, "+name");
		Page<Transporter> pageTransporter = transporterServiceImpl.findAll(spec, pageRequest);
		if (page > pageTransporter.getTotalPages()) {
			throw new Exception();
		}
		return pageTransporter;
	}

	@RequestMapping(value = "/transporters", method = RequestMethod.POST)
	@ResponseBody
	public String create(@RequestBody Transporter transporter) {

		try {
			transporterServiceImpl.save(transporter);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@RequestMapping(value = "/transporters/{uuid}", method = RequestMethod.GET)
	public Transporter getTransporter(@PathVariable String uuid) throws Exception {
		return transporterServiceImpl.findByUuid(uuid);
	}

	@RequestMapping(value = "/transporters/{uuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public String deleteTransporter(@PathVariable String uuid) throws Exception {
		Transporter transporter = null;
		try {
			transporter = transporterServiceImpl.findByUuid(uuid);
			transporterServiceImpl.delete(transporter);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@RequestMapping(value = "/transporters", method = RequestMethod.PUT)
	@ResponseBody
	public String update(@RequestBody Transporter transporter) throws Exception {
		try {
			transporterServiceImpl.save(transporter);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

}
