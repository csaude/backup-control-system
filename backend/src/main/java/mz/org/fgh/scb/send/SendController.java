/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.send;

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
@Api(tags = { "Send" })
public class SendController {

	@Autowired
	private SendServiceImpl sendServiceImpl;

	@GetMapping(value = "/v1/sends")
	public Page<Send> findSends(
			@RequestParam(value = "fields", required = true) String fields, 
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = true) String page, 
			@RequestParam(value = "pageSize", required = true) String pageSize)
			throws Exception {

		SendSpecificationsBuilder builder = new SendSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:gte:|:lte:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Send> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<Send> pageSend = sendServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (Integer.valueOf(page + "") > pageSend.getTotalPages()) {
				throw new Exception();
			}
		}

		return pageSend;
	}

	@PostMapping(value = "/v1/sends")
	@ResponseBody
	public String createSend(@RequestBody Send send) {
		try {
			sendServiceImpl.save(send);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/v1/sends/{uuid}")
	public Send findOneSendByUuid(@PathVariable String uuid){
		Send send = sendServiceImpl.findOneByUuid(uuid);
		if (send == null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
			return send;
	}

	@DeleteMapping(value = "/v1/sends/{uuid}")
	@ResponseBody
	public Object deleteSend(@PathVariable String uuid) {
		Send send = null;
		try {
			send = sendServiceImpl.findOneByUuid(uuid);
			sendServiceImpl.delete(send);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return send;
	}

	@PutMapping(value = "/v1/sends")
	@ResponseBody
	public String updateSend(@RequestBody Send send) {
		try {
			sendServiceImpl.save(send);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

}
