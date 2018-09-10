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
import mz.org.fgh.scb.model.entity.Receive;
import mz.org.fgh.scb.service.impl.ReceiveServiceImpl;
import mz.org.fgh.scb.specification.ReceiveSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Receives
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = {"Receive"})
public class ReceiveController {

	@Autowired
	private ReceiveServiceImpl receiveServiceImpl;

	@GetMapping(value = "/receives")
	public Page<Receive> findReceives(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		ReceiveSpecificationsBuilder builder = new ReceiveSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Receive> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(size, page, "-send.backupdate");
		Page<Receive> pageReceive = receiveServiceImpl.findAll(spec, pageRequest);
		if (page > pageReceive.getTotalPages()) {
			throw new Exception();
		}
		return pageReceive;
	}

	@PostMapping(value = "/receive")
	@ResponseBody
	public String createReceive(@RequestBody Receive receive) {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/receive/{uuid}")
	public Receive findOneReceiveByUuid(@PathVariable String uuid) throws Exception {
		return receiveServiceImpl.findOneByUuid(uuid);
	}
	
	@GetMapping(value = "/receive/send/{uuid}")
	public Object findOneReceiveBySendUuid(@PathVariable String uuid) throws Exception {
		return receiveServiceImpl.findOneBySendUuid(uuid);
	}

	@DeleteMapping(value = "/receive/{uuid}")
	@ResponseBody
	public Object deleteReceive(@PathVariable String uuid) throws Exception {
		Receive receive = null;
		try {
			receive = receiveServiceImpl.findOneByUuid(uuid);
			receiveServiceImpl.delete(receive);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return receive;
	}

	@PutMapping(value = "/receive")
	@ResponseBody
	public String updateReceive(@RequestBody Receive receive) throws Exception {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
