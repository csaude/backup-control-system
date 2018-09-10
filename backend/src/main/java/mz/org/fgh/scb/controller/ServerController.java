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
@Api(tags = {"Server"})
public class ServerController {

	@Autowired
	private ServerServiceImpl serverServiceImpl;

	@GetMapping(value = "/servers")
	public Page<Server> findServers(@RequestParam(value = "page", required = true) int page, @RequestParam(value = "size", required = true) int size, @RequestParam(value = "search", required = false) String search) throws Exception {

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

	@GetMapping(value = "/server/{uuid}")
	public Server findOneServerByUuid(@PathVariable String uuid) throws Exception {
		return serverServiceImpl.findOneByUuid(uuid);
	}

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
