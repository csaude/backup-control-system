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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

import mz.org.fgh.scb.model.entity.Sync;
import mz.org.fgh.scb.service.impl.SyncServiceImpl;
import mz.org.fgh.scb.specification.SyncSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Syncs
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class SyncController {

	@Autowired
	private SyncServiceImpl syncServiceImpl;
	
	@GetMapping(value = "/syncs")
	public Page<Sync> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		SyncSpecificationsBuilder builder = new SyncSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Sync> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(size, page, "-starttime");
		Page<Sync> pageSync = syncServiceImpl.findAll(spec, pageRequest);
		if (page > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;
	}

	@PostMapping(value = "/syncs")
	@ResponseBody
	public String create(@RequestBody Sync sync) {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/syncs/{uuid}")
	public Object getSync(@PathVariable String uuid) throws Exception {
		return syncServiceImpl.findByUuid(uuid);
	}
	
	@GetMapping(value = "/syncsinprogress")
	public int findInProgress() throws Exception {
		return syncServiceImpl.findInProgress();
	}
	
	@GetMapping(value = "/syncsinprogressuser")
	public int findInProgressByUser() throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		return syncServiceImpl.findInProgressByUser(currentPrincipalName);
	}

	@DeleteMapping(value = "/syncs/{uuid}")
	@ResponseBody
	public Object deleteSync(@PathVariable String uuid) throws Exception {
		Sync sync = null;
		try {
			sync = syncServiceImpl.findByUuid(uuid);
			syncServiceImpl.delete(sync);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return sync;
	}

	@PutMapping(value = "/syncs")
	@ResponseBody
	public String update(@RequestBody Sync sync) throws Exception {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

}
