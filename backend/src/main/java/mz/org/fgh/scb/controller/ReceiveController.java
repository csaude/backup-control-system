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
import mz.org.fgh.scb.model.entity.Receive;
import mz.org.fgh.scb.model.entity.Send;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.ReceiveServiceImpl;
import mz.org.fgh.scb.specification.ReceiveSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Receives
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "Receive" })
public class ReceiveController {

	@Autowired
	private ReceiveServiceImpl receiveServiceImpl;

	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return District records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/receives")
	public Page<Receive> findReceives(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = true) String pageNumber, @RequestParam(value = "pageSize", required = true) String pageSize) throws Exception {
		ReceiveSpecificationsBuilder builder = new ReceiveSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(=eq:|=gte:|=lte:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filterCriteria + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Receive> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, sortingCriteria);
		Page<Receive> pageReceive = receiveServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
			if (pageNumber != null) {
				if (Integer.valueOf(pageNumber + "") > pageReceive.getTotalPages()) {
					throw new SearchControllerException("Cant retrieve any data, update your filter or contact the System Administrator.");
				}
			}
		}
		return pageReceive;
	}

	/**
	 * @param receive the Receive
	 * @return Success or error
	 */
	@PostMapping(value = "/receive")
	@ResponseBody
	public String createReceive(@RequestBody Receive receive) {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param uuid the Receive uuid
	 * @return the Receive with the given uuid
	 * @throws Exception
	 */
	@GetMapping(value = "/receive/{uuid}")
	public Receive findOneReceiveByUuid(@PathVariable String uuid) throws Exception {
		return receiveServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param uuid the Send {@link Send} uuid
	 * @return the Recieve with the given Send uuid
	 * @throws Exception if error occurred
	 */
	@GetMapping(value = "/receive/send/{uuid}")
	public Object findOneReceiveBySendUuid(@PathVariable String uuid) throws Exception {
		return receiveServiceImpl.findOneBySendUuid(uuid);
	}

	/**
	 * @param uuid the Receive uuid
	 * @return the deleted Receive
	 * @throws Exception if error occurred
	 */
	@DeleteMapping(value = "/receive/{uuid}")
	@ResponseBody
	public Object deleteReceive(@PathVariable String uuid) throws Exception {
		Receive receive = null;
		try {
			receive = receiveServiceImpl.findOneByUuid(uuid);
			receiveServiceImpl.delete(receive);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return receive;
	}

	/**
	 * @param receive
	 * @return
	 * @throws Exception
	 */
	@PutMapping(value = "/receive")
	@ResponseBody
	public String updateReceive(@RequestBody Receive receive) throws Exception {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
