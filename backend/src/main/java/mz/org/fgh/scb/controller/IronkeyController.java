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
import mz.org.fgh.scb.model.entity.Ironkey;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.IronkeyServiceImpl;
import mz.org.fgh.scb.specification.IronkeySpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Ironkeys
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "Ironkey" })
public class IronkeyController {

	@Autowired
	private IronkeyServiceImpl ironkeyServiceImpl;

	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return Send records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/ironkeys")
	public Page<Ironkey> findIronkeys(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = false) String pageNumber, @RequestParam(value = "pageSize", required = false) String pageSize) throws Exception {
		IronkeySpecificationsBuilder builder = new IronkeySpecificationsBuilder();
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
		Pattern pattern = Pattern.compile("(\\w+?)(=eq:|=like:)(\\w+?),");
		Matcher matcher = pattern.matcher(filterCriteria + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Ironkey> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, "+serial");
		Page<Ironkey> pageIronkey = ironkeyServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
		if (pageNumber != null) {
			if (Integer.valueOf(pageNumber + "") > pageIronkey.getTotalPages()) {
				throw new SearchControllerException("Cant retrieve any data, update your filter or contact the System Administrator.");
			}
		}
		}
		return pageIronkey;
	}

	/**
	 * @param ironkey the Ironkey
	 * @return Success or error
	 */
	@PostMapping(value = "/ironkey")
	@ResponseBody
	public String createIronkey(@RequestBody Ironkey ironkey) {
		try {
			ironkeyServiceImpl.save(ironkey);
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
		return "Success";
	}

	/**
	 * @param uuid the Ironkey uuid
	 * @return the Ironkey
	 * @throws Exception if error is found
	 */
	@GetMapping(value = "/ironkey/{uuid}")
	public Ironkey findOneIronkeyByUuid(@PathVariable String uuid) throws Exception {
		return ironkeyServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param uuid the Ironkey uuid
	 * @return the Ironkey
	 * @throws Exception if error occurred
	 */
	@DeleteMapping(value = "/ironkey/{uuid}")
	@ResponseBody
	public String deleteIronkey(@PathVariable String uuid) throws Exception {
		Ironkey ironkey = null;
		try {
			ironkey = ironkeyServiceImpl.findOneByUuid(uuid);
			ironkeyServiceImpl.delete(ironkey);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param ironkey
	 * @return
	 * @throws Exception
	 */
	@PutMapping(value = "/ironkey")
	@ResponseBody
	public String updateIronkey(@RequestBody Ironkey ironkey) throws Exception {
		try {
			ironkeyServiceImpl.save(ironkey);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
	}
}
