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
import mz.org.fgh.scb.model.entity.Send;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.SendServiceImpl;
import mz.org.fgh.scb.specification.SendSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Send
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "Send" })
public class SendController {

	@Autowired
	private SendServiceImpl sendServiceImpl;

	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return Send records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/sends")
	public Page<Send> findSends(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = true) String pageNumber, @RequestParam(value = "pageSize", required = true) String pageSize) throws Exception {
		SendSpecificationsBuilder builder = new SendSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(=eq:|=gte:|=lte:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filterCriteria + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Send> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, sortingCriteria);
		Page<Send> pageSend = sendServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
			if (Integer.valueOf(pageNumber + "") > pageSend.getTotalPages()) {
				throw new SearchControllerException("Could not retrieve results, update the filter criteria or contact the System Administrator.");
			}
		}
		return pageSend;
	}

	/**
	 * @param send the Send object to be persisted
	 * @return Sucess on save or Error if something goes wrong
	 */
	@PostMapping(value = "/send")
	@ResponseBody
	public String createSend(@RequestBody Send send) {
		try {
			// Returns success on save
			sendServiceImpl.save(send);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param uuid the Send uuid
	 * @return the Send with the given uuid
	 * @throws Exception if that this Send cant be found
	 */
	@GetMapping(value = "/send/{uuid}")
	public Object findOneSendByUuid(@PathVariable String uuid) throws Exception {
		// Find the Send with the given uuid
		return sendServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param uuid the Send uuid
	 * @return the Send deleted
	 * @throws Exception if this Send cant be deleted
	 */
	@DeleteMapping(value = "/send/{uuid}")
	@ResponseBody
	public Object deleteSend(@PathVariable String uuid) throws Exception {
		Send send = null;
		try {
			send = sendServiceImpl.findOneByUuid(uuid);
			sendServiceImpl.delete(send);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return send;
	}

	/**
	 * @param send the Send
	 * @return Sucess on save or Error if something goes wrong
	 * @throws Exception if specific error occurred during update
	 */
	@PutMapping(value = "/send")
	@ResponseBody
	public String updateSend(@RequestBody Send send) throws Exception {
		try {
			sendServiceImpl.save(send);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

}
