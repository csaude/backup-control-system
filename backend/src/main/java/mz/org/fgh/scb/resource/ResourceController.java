/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
@ApiIgnore
public class ResourceController {

	@Autowired
	private ResourceServiceImpl resourceServiceImpl;

	// -------------------------------------------------
	// ADITIONAL INFO
	// -------------------------------------------------
	@GetMapping(value = "/v1/districtsInformation")
	public List<Object[]> findDistrictsInfo() {
		return resourceServiceImpl.findDistrictsInfo();
	}

	@GetMapping(value = "/v1/serversInformation")
	public List<Object[]> findLastSyncByServer() {
		return resourceServiceImpl.findLastSyncByServer();
	}

	// -------------------------------------------------
	// INFO FOR DASHBOARD
	// -------------------------------------------------
	@GetMapping(value = "/v1/districtsreceivedpreviousmonth")
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth() {
		return resourceServiceImpl.findBackupReceivedByDistrictOnPreviousMonth();
	}

	@GetMapping(value = "/v1/districtsreceivedthismonth")
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth() {
		return resourceServiceImpl.findBackupReceivedByDistrictOnThisMonth();
	}

	@GetMapping(value = "/v1/districtsreceivedlastmonths")
	public List<Object[]> findBackupReceivedOnLast12Months() {
		return resourceServiceImpl.findBackupReceivedOnLast12Months();
	}

	@GetMapping(value = "/v1/serverssyncspreviousweek")
	public List<Object[]> findSyncsOfPreviousWeek() {
		return resourceServiceImpl.findSyncsOfPreviousWeek();
	}

	@GetMapping(value = "/v1/serverssyncsthisweek")
	public List<Object[]> findSyncsOfThisWeek() {
		return resourceServiceImpl.findSyncsOfThisWeek();
	}

	@GetMapping(value = "/v1/serverssyncsitemspreviousweek")
	public List<Object[]> findSyncsRemainingItemsOfPreviousWeek() {
		return resourceServiceImpl.findSyncsRemainingItemsOfPreviousWeek();
	}

	@GetMapping(value = "/v1/serverssyncsitemsthisweek")
	public List<Object[]> findSyncsRemainingItemsOfThisWeek() {
		return resourceServiceImpl.findSyncsRemainingItemsOfThisWeek();
	}

	// -------------------------------------------------
	// FOR USER NOTIFICATION
	// -------------------------------------------------
	@GetMapping(value = "/v1/sendsnotreceived")
	public int findNumberOfAllBackupsNotReceived() throws Exception {
		return resourceServiceImpl.findNumberOfAllBackupsNotReceived();
	}

	@GetMapping(value = "/v1/syncsinprogress")
	public int findSyncsInProgress() throws Exception {
		return resourceServiceImpl.findSyncsInProgress();
	}

	@GetMapping(value = "/v1/syncsinprogressuser")
	public int findSyncsInProgressByUser() throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = authentication.getName();
		return resourceServiceImpl.findSyncsInProgressByUser(loggedUsername);
	}

}
