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
import mz.org.fgh.scb.exception.SearchControllerException;
import mz.org.fgh.scb.model.entity.District;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.DistrictServiceImpl;
import mz.org.fgh.scb.specification.DistrictSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for Districts
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "District" })
public class DistrictController {

	@Autowired
	private DistrictServiceImpl districtServiceImpl;

	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return District records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/districts")
	public Page<District> findDistricts(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = false) String pageNumber, @RequestParam(value = "pageSize", required = false) String pageSize) throws Exception {
		DistrictSpecificationsBuilder builder = new DistrictSpecificationsBuilder();
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
		Specification<District> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, sortingCriteria);
		Page<District> pageDistrict = districtServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
			if (Integer.valueOf(pageNumber + "") > pageDistrict.getTotalPages()) {
				throw new SearchControllerException("Could not retrieve results, if you are allocated to any District update the filter criteria or contact the System Administrator.");
			}
		}
		return pageDistrict;
	}

	/**
	 * @param uuid the District uuid
	 * @return the District
	 * @throws Exception on error persisting the Entity
	 */
	@GetMapping(value = "/district/{uuid}")
	public District findOneDistrictByUuid(@PathVariable String uuid) throws Exception {
		return districtServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param district the District
	 * @return Sucess or error
	 */
	@PostMapping(value = "/district")
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

	/**
	 * @param uuid the District uuid
	 * @return Success or Error
	 * @throws Exception on error
	 */
	@DeleteMapping(value = "/district/{uuid}")
	@ResponseBody
	public String deleteDistrict(@PathVariable String uuid) throws Exception {
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

	/**
	 * @param district the District
	 * @return Success or Error
	 * @throws Exception if error occurred
	 */
	@PutMapping(value = "/district")
	@ResponseBody
	public String updateDistrict(@RequestBody District district) throws Exception {
		try {
			districtServiceImpl.save(district);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param uuid       the District uuid
	 * @param evaluation the OpenMRS SQL dataset evaluation
	 * @return OpenMRS sql result data
	 */
	@GetMapping(value = "/district/{uuid}/{evaluation}")
	public Object evaluateDistrict(@PathVariable String uuid, @PathVariable String evaluation) {
		District district = districtServiceImpl.findOneByUuid(uuid);
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

	/**
	 * @param uuid the District uuid
	 * @return the OpenMRS session
	 */
	@GetMapping(value = "/district/openmrs/{uuid}")
	public Object checkConnection(@PathVariable String uuid) {
		District district = districtServiceImpl.findOneByUuid(uuid);
		String plainCreds = district.getInstance_username() + ":" + district.getInstance_password();
		byte[] plainCredsBytes = plainCreds.getBytes();
		byte[] base64CredsBytes = Base64.encode(plainCredsBytes);
		String base64Creds = new String(base64CredsBytes);
		RestTemplate restTemplate = new RestTemplate();
		final String url = district.getInstance_url() + "/ws/rest/v1/session";
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Basic " + base64Creds);
		HttpEntity<String> request = new HttpEntity<String>(headers);
		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
		return response.getBody();

	}

}
