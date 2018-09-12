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
import mz.org.fgh.scb.model.entity.Sync;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.SyncServiceImpl;
import mz.org.fgh.scb.specification.SyncSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Syncs
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = {"Sync"})
public class SyncController {

	@Autowired
	private SyncServiceImpl syncServiceImpl;
	
	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return District records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/syncs")
	public Page<Sync> findSyncs(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = true) String pageNumber, @RequestParam(value = "pageSize", required = true) String pageSize) throws Exception {
		SyncSpecificationsBuilder builder = new SyncSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(=eq:|=gte:|=lte:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filterCriteria + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Sync> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, sortingCriteria);
		Page<Sync> pageSync = syncServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
			if (Integer.valueOf(pageNumber + "") > pageSync.getTotalPages()) {
				throw new SearchControllerException("Could not retrieve results, update the filter criteria or contact the System Administrator.");
			}
		}
		return pageSync;
	}

	/**
	 * @param sync the Sync
	 * @return Succes or Error
	 */
	@PostMapping(value = "/sync")
	@ResponseBody
	public String createSync(@RequestBody Sync sync) {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param uuid the Send uuid
	 * @return the Send with the given uuid
	 * @throws Exception if error occurred
	 */
	@GetMapping(value = "/sync/{uuid}")
	public Object findOneSyncByUuid(@PathVariable String uuid) throws Exception {
		return syncServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param uuid the Sync uuid
	 * @return the Sync deleted
	 * @throws Exception if error occurred
	 */
	@DeleteMapping(value = "/sync/{uuid}")
	@ResponseBody
	public Object deleteSync(@PathVariable String uuid) throws Exception {
		Sync sync = null;
		try {
			sync = syncServiceImpl.findOneByUuid(uuid);
			syncServiceImpl.delete(sync);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return sync;
	}

	/**
	 * @param sync
	 * @return
	 * @throws Exception
	 */
	@PutMapping(value = "/sync")
	@ResponseBody
	public String updateSync(@RequestBody Sync sync) throws Exception {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

}
