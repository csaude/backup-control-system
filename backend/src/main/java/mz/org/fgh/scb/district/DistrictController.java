/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.district;

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

import io.swagger.annotations.Api;
import mz.org.fgh.scb.exception.ItemNotFoundException;
import mz.org.fgh.scb.filter.PageRequestBuilder;

/**
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "District" })
public class DistrictController {

	@Autowired
	private DistrictServiceImpl districtServiceImpl;

	@GetMapping(value = "/v1/districts")
	public Page<District> findDistricts(
			@RequestParam(value = "fields", required = true) String fields, 
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = false) String page, 
			@RequestParam(value = "pageSize", required = false) String pageSize)
			throws Exception {
		DistrictSpecificationsBuilder builder = new DistrictSpecificationsBuilder();
		if(page == null || page.isEmpty() || pageSize == null || pageSize.isEmpty()) {
			page = null;
			pageSize = null;
		}
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:like:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<District> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<District> pageDistrict = districtServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (Integer.valueOf(page + "") > pageDistrict.getTotalPages()) {
				throw new Exception();
			}
		}
		
		return pageDistrict;
	}

	@GetMapping(value = "/v1/districts/{uuid}")
	public District findOneDistrictByUuid(@PathVariable String uuid){
		District district=districtServiceImpl.findOneByUuid(uuid);
		if (district==null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
		return district;
	}

	@PostMapping(value = "/v1/districts")
	@ResponseBody
	public String createDistrict(@RequestBody District district) {
		try {
			districtServiceImpl.save(district);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@DeleteMapping(value = "/v1/districts/{uuid}")
	@ResponseBody
	public String deleteDistrict(@PathVariable String uuid){
		District district = null;
		try {
			district = districtServiceImpl.findOneByUuid(uuid);
			districtServiceImpl.delete(district);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@PutMapping(value = "/v1/districts")
	@ResponseBody
	public String updateDistrict(@RequestBody District district){
		try {
			districtServiceImpl.save(district);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/v1/districts/{uuid}/{evaluation}")
	public Object evaluateDistrict(@PathVariable String uuid, @PathVariable String evaluation) {
		District district = districtServiceImpl.findOneByUuid(uuid);
		String plainCreds = district.getInstanceUsername() + ":" + district.getInstancePassword();
		byte[] plainCredsBytes = plainCreds.getBytes();
		byte[] base64CredsBytes = Base64.encode(plainCredsBytes);
		String base64Creds = new String(base64CredsBytes);
		RestTemplate restTemplate = new RestTemplate();
		final String url = district.getInstanceUrl() + "/v1/ws/rest/v1/reportingrest/dataSet/" + evaluation;
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Basic " + base64Creds);
		HttpEntity<String> request = new HttpEntity<String>(headers);
		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
		return response.getBody();
	}

	@GetMapping(value = "/v1/districts/openmrs/{uuid}")
	public Object checkConnection(@PathVariable String uuid) {
		District district = districtServiceImpl.findOneByUuid(uuid);
		String plainCreds = district.getInstanceUsername() + ":" + district.getInstancePassword();
		byte[] plainCredsBytes = plainCreds.getBytes();
		byte[] base64CredsBytes = Base64.encode(plainCredsBytes);
		String base64Creds = new String(base64CredsBytes);
		RestTemplate restTemplate = new RestTemplate();
		final String url = district.getInstanceUrl() + "/v1/ws/rest/v1/session";
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Basic " + base64Creds);
		HttpEntity<String> request = new HttpEntity<String>(headers);
		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
		return response.getBody();

	}

}
