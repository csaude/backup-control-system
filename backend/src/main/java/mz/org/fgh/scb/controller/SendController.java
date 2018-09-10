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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.model.entity.Send;
import mz.org.fgh.scb.service.impl.SendServiceImpl;
import mz.org.fgh.scb.specification.SendSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Sends
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class SendController {

	@Autowired
	private SendServiceImpl sendServiceImpl;

	@PostMapping(value = "/sends")
	@ResponseBody
	public String create(@RequestBody Send send) {
		try {
			sendServiceImpl.save(send);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/sends/{uuid}")
	public Object getSend(@PathVariable String uuid) throws Exception {
		return sendServiceImpl.findByUuid(uuid);
	}
	
	@GetMapping(value = "/sends")
	public Page<Send> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		SendSpecificationsBuilder builder = new SendSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Send> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(size, page, "-backupdate");
		Page<Send> pageSend = sendServiceImpl.findAll(spec, pageRequest);
		if (page > pageSend.getTotalPages()) {
			throw new Exception();
		}
		return pageSend;
	}

	@DeleteMapping(value = "/sends/{uuid}")
	@ResponseBody
	public Object deleteSend(@PathVariable String uuid) throws Exception {
		Send send = null;
		try {
			send = sendServiceImpl.findByUuid(uuid);
			sendServiceImpl.delete(send);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return send;
	}

	@PutMapping(value = "/sends")
	@ResponseBody
	public String update(@RequestBody Send send) throws Exception {
		try {
			sendServiceImpl.save(send);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
	
	@RequestMapping(value = "/sendss/{id}", method = RequestMethod.GET)
	public Object getSendById(@PathVariable Long id) throws Exception {
		return sendServiceImpl.findById(id);
	}
	
	//-------------------------------------------------
	//FOR USER NOTIFICATION
	//-------------------------------------------------
	@GetMapping(value = "/sendsnotreceived")
	public int findByAllNotReceived() throws Exception {
		return sendServiceImpl.findNumberOfAllNotReceived();
	}
	
}
