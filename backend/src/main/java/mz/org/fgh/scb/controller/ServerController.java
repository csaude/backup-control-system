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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.model.entity.Server;
import mz.org.fgh.scb.service.impl.ServerServiceImpl;
import mz.org.fgh.scb.specification.ServerSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Servers
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class ServerController {

	@Autowired
	private ServerServiceImpl serverServiceImpl;

	@RequestMapping(value = "/servers", method = RequestMethod.GET)
	public List<Server> findAllByOrderBySerialAsc() {
		return serverServiceImpl.findAllByOrderByNameAsc();
	}
	
	@RequestMapping(value = "/serversdistrict/{district_id}", method = RequestMethod.GET)
	public List<Server> findByDistrictId(@PathVariable Long district_id) {
		return serverServiceImpl.findByDistrictId(district_id);
	}
	
	@RequestMapping(value = "/serverssyncspreviousweek", method = RequestMethod.GET)
	public List<Object[]> findSyncsOfPreviousWeek() {
		return serverServiceImpl.findSyncsOfPreviousWeek();
	}
	
	@RequestMapping(value = "/serverssyncsthisweek", method = RequestMethod.GET)
	public List<Object[]> findSyncsOfThisWeek() {
		return serverServiceImpl.findSyncsOfThisWeek();
	}
	
	@RequestMapping(value = "/serverssyncsitemspreviousweek", method = RequestMethod.GET)
	public List<Object[]> findSyncsItemsOfPreviousWeek() {
		return serverServiceImpl.findSyncsRemainingItemsOfPreviousWeek();
	}
	
	@RequestMapping(value = "/serverssyncsitemsthisweek", method = RequestMethod.GET)
	public List<Object[]> findSyncsItemsOfThisWeek() {
		return serverServiceImpl.findSyncsRemainingItemsOfThisWeek();
	}
	
	@RequestMapping(value = "/serversuser", method = RequestMethod.GET)
	public List<Server> findByUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		return serverServiceImpl.findByUsername(currentPrincipalName);
	}
	
	@RequestMapping(value = "/serverssyncinfo", method = RequestMethod.GET)
	public List<Object[]> findLastSyncByServer() {
		return serverServiceImpl.findLastSyncByServer();
	}

	@RequestMapping(value = "/servers/get", method = RequestMethod.GET)
	public Page<Server> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		
		ServerSpecificationsBuilder builder = new ServerSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Server> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(size, page, "+district.name,+name");
		Page<Server> pageServer = serverServiceImpl.findAll(spec, pageRequest);
		if (page > pageServer.getTotalPages()) {
			throw new Exception();
		}
		return pageServer;
	}

	@RequestMapping(value = "/servers", method = RequestMethod.POST)
	@ResponseBody
	public String create(@RequestBody Server server) {
		try {
			serverServiceImpl.save(server);
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
		return "Success";
	}

	@RequestMapping(value = "/servers/{uuid}", method = RequestMethod.GET)
	public Server getServer(@PathVariable String uuid) throws Exception {
		return serverServiceImpl.findByUuid(uuid);
	}

	@RequestMapping(value = "/servers/{uuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public String deleteServer(@PathVariable String uuid) throws Exception {
		Server server = null;
		try {
			server = serverServiceImpl.findByUuid(uuid);
			serverServiceImpl.delete(server);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@RequestMapping(value = "/servers", method = RequestMethod.PUT)
	@ResponseBody
	public String update(@RequestBody Server server) throws Exception {
		try {
			serverServiceImpl.save(server);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
	}
}
