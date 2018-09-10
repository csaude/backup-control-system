/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.service.impl.ResourceServiceImpl;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Defines the rest endpoint configuration for Districts
 * 
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
	// INFO FOR DASHBOARD
	// -------------------------------------------------
	@GetMapping(value = "/districtsreceiveinfo")
	public List<Object[]> findLastBackupReceivedByDistrict() {
		return resourceServiceImpl.findLastBackupReceivedByDistrict();
	}

	@GetMapping(value = "/districtsrestoreinfo")
	public List<Object[]> findLastBackupRestoredByDistrict() {
		return resourceServiceImpl.findLastBackupRestoredByDistrict();
	}

	@GetMapping(value = "/districtssyncinfo")
	public List<Object[]> findLastSyncByDistrict() {
		return resourceServiceImpl.findLastSyncByDistrict();
	}

	@GetMapping(value = "/districtsreceivedpreviousmonth")
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth() {
		return resourceServiceImpl.findBackupReceivedByDistrictOnPreviousMonth();
	}

	@GetMapping(value = "/districtsreceivedthismonth")
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth() {
		return resourceServiceImpl.findBackupReceivedByDistrictOnThisMonth();
	}

	@GetMapping(value = "/districtsreceivedlastmonths")
	public List<Object[]> findBackupReceivedOnLast12Months() {
		return resourceServiceImpl.findBackupReceivedOnLast12Months();
	}

	@GetMapping(value = "/serverssyncspreviousweek")
	public List<Object[]> findSyncsOfPreviousWeek() {
		return resourceServiceImpl.findSyncsOfPreviousWeek();
	}

	@GetMapping(value = "/serverssyncsthisweek")
	public List<Object[]> findSyncsOfThisWeek() {
		return resourceServiceImpl.findSyncsOfThisWeek();
	}

	@GetMapping(value = "/serverssyncsitemspreviousweek")
	public List<Object[]> findSyncsRemainingItemsOfPreviousWeek() {
		return resourceServiceImpl.findSyncsRemainingItemsOfPreviousWeek();
	}

	@GetMapping(value = "/serverssyncsitemsthisweek")
	public List<Object[]> findSyncsRemainingItemsOfThisWeek() {
		return resourceServiceImpl.findSyncsRemainingItemsOfThisWeek();
	}

	@GetMapping(value = "/serverssyncinfo")
	public List<Object[]> findLastSyncByServer() {
		return resourceServiceImpl.findLastSyncByServer();
	}

	// -------------------------------------------------
	// FOR USER NOTIFICATION
	// -------------------------------------------------
	@GetMapping(value = "/sendsnotreceived")
	public int findNumberOfAllBackupsNotReceived() throws Exception {
		return resourceServiceImpl.findNumberOfAllBackupsNotReceived();
	}

	@GetMapping(value = "/syncsinprogress")
	public int findSyncsInProgress() throws Exception {
		return resourceServiceImpl.findSyncsInProgress();
	}

	@GetMapping(value = "/syncsinprogressuser")
	public int findSyncsInProgressByUser() throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = authentication.getName();
		return resourceServiceImpl.findSyncsInProgressByUser(loggedUsername);
	}

}
