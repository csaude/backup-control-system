/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.model.entity.Send;
import mz.org.fgh.scb.service.impl.SendServiceImpl;

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

	@RequestMapping(value = "/sends", method = RequestMethod.POST)
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

	@RequestMapping(value = "/sends/{uuid}", method = RequestMethod.GET)
	public Object getSend(@PathVariable String uuid) throws Exception {
		return sendServiceImpl.findByUuid(uuid);
	}
	
	@RequestMapping(value = "/sendsnotreceived", method = RequestMethod.GET)
	public int findByAllNotReceived() throws Exception {
		return sendServiceImpl.findByAllNotReceived();
	}
	
	@RequestMapping(value = "/sendss/{id}", method = RequestMethod.GET)
	public Object getSendById(@PathVariable Long id) throws Exception {
		return sendServiceImpl.findById(id);
	}
	
	@RequestMapping(value = "/sendsdistrict/get", method = RequestMethod.GET)
	public Page<Send> findByDistrictId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "district", required = true) Long district_id) throws Exception {
		Page<Send> pageSend = sendServiceImpl.findByDistrictId(district_id,
				new PageRequest(page - 1, 10));
		if (page - 1 > pageSend.getTotalPages()) {
			throw new Exception();
		}
		return pageSend;	
	}
	
	@RequestMapping(value = "/sendsuser/get", method = RequestMethod.GET)
	public Page<Send> findByUserId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		Page<Send> pageSend = sendServiceImpl.findByUsername(
				new PageRequest(page - 1, 10),currentPrincipalName);
		if (page - 1 > pageSend.getTotalPages()) {
			throw new Exception();
		}
		return pageSend;	
	}
	
	@RequestMapping(value = "/sendsall/get", method = RequestMethod.GET)
	public Page<Send> findAllNotReceived(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size) throws Exception {
		Page<Send> pageSend = sendServiceImpl.findAllNotReceived(new PageRequest(page - 1, 10));
		if (page - 1 > pageSend.getTotalPages()) {
			throw new Exception();
		}
		return pageSend;	
	}
	
	@RequestMapping(value = "/sendsdistrictdate/get", method = RequestMethod.GET)
	public Page<Send> findByDistrictIdDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "district", required = true) Long district_id,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until
					) throws Exception {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Send> pageSend = sendServiceImpl.findByDistrictIdAndBackupDateRange(district_id,
				new PageRequest(page - 1, 10),date_from,date_until);
		if (page - 1 > pageSend.getTotalPages()) {
			throw new Exception();
		}
		return pageSend;	
	}
	
	@RequestMapping(value = "/sendsuserdate/get", method = RequestMethod.GET)
	public Page<Send> findByUserIdDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until
					) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Send> pageSend = sendServiceImpl.findByUsernameAndBackupDateRange(
				new PageRequest(page - 1, 10),date_from,date_until,currentPrincipalName);

		if (page - 1 > pageSend.getTotalPages()) {
			throw new Exception();
		}
		return pageSend;	
	}

	@RequestMapping(value = "/sends/{uuid}", method = RequestMethod.DELETE)
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

	@RequestMapping(value = "/sends", method = RequestMethod.PUT)
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

}
