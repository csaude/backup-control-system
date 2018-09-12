/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.repository.ResourceRepository;
import mz.org.fgh.scb.service.api.ResourceService;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Service
public class ResourceServiceImpl implements ResourceService {

	@Autowired
	ResourceRepository resourceRepository;

	@Override
	public List<Object[]> findLastBackupReceivedByDistrict() {
		return resourceRepository.findLastBackupReceivedByDistrict();
	}

	@Override
	public List<Object[]> findLastBackupRestoredByDistrict() {
		return resourceRepository.findLastBackupRestoredByDistrict();
	}

	@Override
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth() {
		return resourceRepository.findBackupReceivedByDistrictOnPreviousMonth();
	}

	@Override
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth() {
		return resourceRepository.findBackupReceivedByDistrictOnThisMonth();
	}

	@Override
	public List<Object[]> findBackupReceivedOnLast12Months() {
		return resourceRepository.findBackupReceivedOnLast12Months();
	}

	@Override
	public List<Object[]> findLastSyncByDistrict() {
		return resourceRepository.findLastSyncByDistrict();
	}

	@Override
	public List<Object[]> findLastSyncByServer() {
		return resourceRepository.findLastSyncByServer();
	}

	@Override
	public List<Object[]> findSyncsOfPreviousWeek() {
		return resourceRepository.findSyncsOfPreviousWeek();
	}

	@Override
	public List<Object[]> findSyncsOfThisWeek() {
		return resourceRepository.findSyncsOfThisWeek();
	}

	@Override
	public List<Object[]> findSyncsRemainingItemsOfThisWeek() {
		return resourceRepository.findSyncsRemainingItemsOfThisWeek();
	}

	@Override
	public List<Object[]> findSyncsRemainingItemsOfPreviousWeek() {
		return resourceRepository.findSyncsRemainingItemsOfPreviousWeek();
	}

	@Override
	public List<String> findUsersForSendNotification(Long district_id) {
		return resourceRepository.findUsersForSendNotification(district_id);
	}

	@Override
	public List<String> findUsersForReceiveNotification(Long district_id) {
		return resourceRepository.findUsersForReceiveNotification(district_id);
	}

	@Override
	public List<String> findUsersForSyncNotification(Long district_id) {
		return resourceRepository.findUsersForSyncNotification(district_id);
	}

	@Override
	public int findSyncsInProgress() {
		return resourceRepository.findSyncsInProgress();
	}

	@Override
	public int findSyncsInProgressByUser(String username) {
		return resourceRepository.findSyncsInProgressByUser(username);
	}

	@Override
	public int findNumberOfAllBackupsNotReceived() {
		return resourceRepository.findNumberOfAllBackupsNotReceived();
	}
	
}
