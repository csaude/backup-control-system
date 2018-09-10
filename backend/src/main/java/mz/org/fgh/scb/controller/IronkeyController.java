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

import mz.org.fgh.scb.model.entity.Ironkey;
import mz.org.fgh.scb.service.impl.IronkeyServiceImpl;
import mz.org.fgh.scb.specification.IronkeySpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Ironkeys
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class IronkeyController {

	@Autowired
	private IronkeyServiceImpl ironkeyServiceImpl;

	@GetMapping(value = "/ironkeys")
	public Page<Ironkey> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		
		IronkeySpecificationsBuilder builder = new IronkeySpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Ironkey> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(size, page, "+serial");
		Page<Ironkey> pageIronkey = ironkeyServiceImpl.findAll(spec, pageRequest);
		if (page > pageIronkey.getTotalPages()) {
			throw new Exception();
		}
		return pageIronkey;
	}

	@PostMapping(value = "/ironkeys")
	@ResponseBody
	public String create(@RequestBody Ironkey ironkey) {
		try {
			ironkeyServiceImpl.save(ironkey);
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
		return "Success";
	}

	@GetMapping(value = "/ironkeys/{uuid}")
	public Ironkey getIronkey(@PathVariable String uuid) throws Exception {
		return ironkeyServiceImpl.findByUuid(uuid);
	}

	@RequestMapping(value = "/ironkeys/{uuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public String deleteIronkey(@PathVariable String uuid) throws Exception {
		Ironkey ironkey = null;
		try {
			ironkey = ironkeyServiceImpl.findByUuid(uuid);
			ironkeyServiceImpl.delete(ironkey);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@PutMapping(value = "/ironkeys")
	@ResponseBody
	public String update(@RequestBody Ironkey ironkey) throws Exception {
		try {
			ironkeyServiceImpl.save(ironkey);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
	}
}
