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
import mz.org.fgh.scb.model.entity.Server;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.ServerServiceImpl;
import mz.org.fgh.scb.specification.ServerSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Servers
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "Server" })
public class ServerController {

	@Autowired
	private ServerServiceImpl serverServiceImpl;

	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return District records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/servers")
	public Page<Server> findServers(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = false) String pageNumber, @RequestParam(value = "pageSize", required = false) String pageSize) throws Exception {
		ServerSpecificationsBuilder builder = new ServerSpecificationsBuilder();
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
		Pattern pattern = Pattern.compile("(\\w+?)(=eq:|=like:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filterCriteria + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Server> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, sortingCriteria);
		Page<Server> pageServer = serverServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
			if (Integer.valueOf(pageNumber + "") > pageServer.getTotalPages()) {
				throw new SearchControllerException("Could not retrieve results, if you are allocated to any District update the filter criteria or contact the System Administrator.");
			}
		}
		return pageServer;
	}

	/**
	 * @param server the Server
	 * @return Success if persist as expected
	 */
	@PostMapping(value = "/server")
	@ResponseBody
	public String createServer(@RequestBody Server server) {
		try {
			serverServiceImpl.save(server);
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
		return "Success";
	}

	/**
	 * @param uuid the Server uuid
	 * @return the Server saved
	 * @throws Exception if error occurred
	 */
	@GetMapping(value = "/server/{uuid}")
	public Server findOneServerByUuid(@PathVariable String uuid) throws Exception {
		return serverServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param uuid the Server uuid
	 * @return the Server
	 * @throws Exception if error occurred during delete
	 */
	@DeleteMapping(value = "/server/{uuid}")
	@ResponseBody
	public String deleteServer(@PathVariable String uuid) throws Exception {
		Server server = null;
		try {
			server = serverServiceImpl.findOneByUuid(uuid);
			serverServiceImpl.delete(server);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param server the Server
	 * @return Success or Error
	 * @throws Exception if error occurred during update
	 */
	@PutMapping(value = "/server")
	@ResponseBody
	public String updateServer(@RequestBody Server server) throws Exception {
		try {
			serverServiceImpl.save(server);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
	}

}
