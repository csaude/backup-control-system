package mz.org.fgh.scb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import mz.org.fgh.scb.model.entity.District;
import mz.org.fgh.scb.service.impl.DistrictServiceImpl;

/**
 * @author damasceno.lopes
 *
 */
@RestController
@RequestMapping("api")
public class DistrictController {

	@Autowired
	private DistrictServiceImpl districtServiceImpl;

	@RequestMapping(value = "/districts", method = RequestMethod.GET)
	public List<District> findAllByOrderByNameAsc() {
		return districtServiceImpl.findAllByOrderByNameAsc();
	}

	@RequestMapping(value = "/districtsreceiveinfo", method = RequestMethod.GET)
	public List<Object[]> findLastBackupReceivedByDistrict() {
		return districtServiceImpl.findLastBackupReceivedByDistrict();
	}

	@RequestMapping(value = "/districtsrestoreinfo", method = RequestMethod.GET)
	public List<Object[]> findLastBackupRestoredByDistrict() {
		return districtServiceImpl.findLastBackupRestoredByDistrict();
	}
	
	@RequestMapping(value = "/districtssyncinfo", method = RequestMethod.GET)
	public List<Object[]> findLastSyncByDistrict() {
		return districtServiceImpl.findLastSyncByDistrict();
	}

	@RequestMapping(value = "/districtsreceivedpreviousmonth", method = RequestMethod.GET)
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth() {
		return districtServiceImpl.findBackupReceivedByDistrictOnPreviousMonth();
	}

	@RequestMapping(value = "/districtsreceivedthismonth", method = RequestMethod.GET)
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth() {
		return districtServiceImpl.findBackupReceivedByDistrictOnThisMonth();
	}

	@RequestMapping(value = "/districtsreceivedlastmonths", method = RequestMethod.GET)
	public List<Object[]> findBackupReceivedOnLast12Months() {
		return districtServiceImpl.findBackupReceivedOnLast12Months();
	}

	@RequestMapping(value = "/districtssendpreviousmonth", method = RequestMethod.GET)
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonthByUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		return districtServiceImpl.findBackupReceivedByDistrictOnPreviousMonthByUser(currentPrincipalName);
	}

	@RequestMapping(value = "/districtssendthismonth", method = RequestMethod.GET)
	public List<Object[]> findBackupReceivedByDistrictOnThisMonthByUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		return districtServiceImpl.findBackupReceivedByDistrictOnThisMonthByUser(currentPrincipalName);
	}

	@RequestMapping(value = "/districts/get", method = RequestMethod.GET)
	public Page<District> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "name", required = true) String name,@RequestParam(value = "canceled", required = true) boolean canceled) throws Exception {
		Page<District> pageDistrict = districtServiceImpl.findAll(name, canceled, new PageRequest(page - 1, size));
		if (page - 1 > pageDistrict.getTotalPages()) {
			throw new Exception();
		}
		return pageDistrict;
	}

	@RequestMapping(value = "/districts/getf", method = RequestMethod.GET)
	public Page<District> findAllByUser(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "name", required = true) String name,@RequestParam(value = "canceled", required = true) boolean canceled) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		Page<District> pageDistrict = districtServiceImpl.findAllByUser(name, currentPrincipalName, canceled,
				new PageRequest(page - 1, size));
		if (page - 1 > pageDistrict.getTotalPages()) {
			throw new Exception();
		}
		return pageDistrict;
	}

	@RequestMapping(value = "/districts", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
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

	@RequestMapping(value = "/districts/{uuid}", method = RequestMethod.GET)
	public District findByUuid(@PathVariable String uuid) throws Exception {
		return districtServiceImpl.findByUuid(uuid);
	}

	@RequestMapping(value = "/districts/{uuid}/{evaluation}", method = RequestMethod.GET)
	public Object Evaluate(@PathVariable String uuid, @PathVariable String evaluation) {
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

	@RequestMapping(value = "/districts/{uuid}", method = RequestMethod.DELETE, produces = "application/json")
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

	@RequestMapping(value = "/districts", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
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
}
