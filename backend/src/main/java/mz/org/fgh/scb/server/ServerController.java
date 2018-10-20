/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.server;

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
import mz.org.fgh.scb.exception.ItemNotFoundException;
import mz.org.fgh.scb.filter.PageRequestBuilder;

/**
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "Server" })
public class ServerController {

	@Autowired
	private ServerServiceImpl serverServiceImpl;

	@GetMapping(value = "/v1/servers")
	public Page<Server> findServers(
			@RequestParam(value = "fields", required = true) String fields, 
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = false) String page, 
			@RequestParam(value = "pageSize", required = false) String pageSize)
			throws Exception {

		ServerSpecificationsBuilder builder = new ServerSpecificationsBuilder();
		if (page == null || page.isEmpty() || pageSize == null || pageSize.isEmpty()) {
			page = null;
			pageSize = null;
		}
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:like:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Server> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<Server> pageServer = serverServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (Integer.valueOf(page + "") > pageServer.getTotalPages()) {
				throw new Exception();
			}
		}

		return pageServer;
	}

	@PostMapping(value = "/v1/servers")
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

	@GetMapping(value = "/v1/servers/{uuid}")
	public Server findOneServerByUuid(@PathVariable String uuid){
		Server server = serverServiceImpl.findOneByUuid(uuid);
		if (server == null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
			return server;
	}

	@DeleteMapping(value = "/v1/servers/{uuid}")
	@ResponseBody
	public String deleteServer(@PathVariable String uuid){
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

	@PutMapping(value = "/v1/servers")
	@ResponseBody
	public String updateServer(@RequestBody Server server){
		try {
			serverServiceImpl.save(server);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
	}

}
