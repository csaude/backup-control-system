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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.codec.Base64;
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
import org.springframework.web.client.RestTemplate;

import mz.org.fgh.scb.model.entity.District;
import mz.org.fgh.scb.service.impl.DistrictServiceImpl;
import mz.org.fgh.scb.specification.DistrictSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Districts
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class DistrictController {

	@Autowired
	private DistrictServiceImpl districtServiceImpl;
	
	@GetMapping(value = "/districts")
	public Page<District> findAll(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		DistrictSpecificationsBuilder builder = new DistrictSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<District> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(size, page, "+parent.name,+name");
		Page<District> pageDistrict = districtServiceImpl.findAll(spec, pageRequest);
		if (page > pageDistrict.getTotalPages()) {
			throw new Exception();
		}
		return pageDistrict;
	}
	
	@GetMapping(value = "/districts/{uuid}")
	public District findByUuid(@PathVariable String uuid) throws Exception {
		return districtServiceImpl.findByUuid(uuid);
	}
	
	@PostMapping(value = "/districts")
	@ResponseBody
	public String create(@RequestBody District district) {
		try {
			districtServiceImpl.save(district);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@DeleteMapping(value = "/districts/{uuid}")
	@ResponseBody
	public String delete(@PathVariable String uuid) throws Exception {
		District district = null;
		try {
			district = districtServiceImpl.findByUuid(uuid);
			districtServiceImpl.delete(district);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@PutMapping(value = "/districts")
	@ResponseBody
	public String update(@RequestBody District district) throws Exception {
		try {
			districtServiceImpl.save(district);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
	
	@GetMapping(value = "/districts/{uuid}/{evaluation}")
	public Object evaluate(@PathVariable String uuid, @PathVariable String evaluation) {
		District district = districtServiceImpl.findByUuid(uuid);
		String plainCreds = district.getInstance_username() + ":" + district.getInstance_password();
		byte[] plainCredsBytes = plainCreds.getBytes();
		byte[] base64CredsBytes = Base64.encode(plainCredsBytes);
		String base64Creds = new String(base64CredsBytes);
		RestTemplate restTemplate = new RestTemplate();
		final String url = district.getInstance_url() + "/ws/rest/v1/reportingrest/dataSet/" + evaluation;
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Basic " + base64Creds);
		HttpEntity<String> request = new HttpEntity<String>(headers);
		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
		return response.getBody();
	}
	
	//-------------------------------------------------
	//INFO FOR DASHBOARD
	//-------------------------------------------------
	@GetMapping(value = "/districtsreceiveinfo")
	public List<Object[]> findLastBackupReceivedByDistrict() {
		return districtServiceImpl.findLastBackupReceivedByDistrict();
	}

	@GetMapping(value = "/districtsrestoreinfo")
	public List<Object[]> findLastBackupRestoredByDistrict() {
		return districtServiceImpl.findLastBackupRestoredByDistrict();
	}
	
	@GetMapping(value = "/districtssyncinfo")
	public List<Object[]> findLastSyncByDistrict() {
		return districtServiceImpl.findLastSyncByDistrict();
	}

	@GetMapping(value = "/districtsreceivedpreviousmonth")
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth() {
		return districtServiceImpl.findBackupReceivedByDistrictOnPreviousMonth();
	}

	@GetMapping(value = "/districtsreceivedthismonth")
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth() {
		return districtServiceImpl.findBackupReceivedByDistrictOnThisMonth();
	}

	@GetMapping(value = "/districtsreceivedlastmonths")
	public List<Object[]> findBackupReceivedOnLast12Months() {
		return districtServiceImpl.findBackupReceivedOnLast12Months();
	}

	
}
