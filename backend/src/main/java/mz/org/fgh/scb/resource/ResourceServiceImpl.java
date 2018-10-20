/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class ResourceServiceImpl implements ResourceService {

	@Autowired
	ResourceRepository resourceRepository;

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findBackupReceivedByDistrictOnPreviousMonth() {
		return resourceRepository.findBackupReceivedByDistrictOnPreviousMonth();
	}

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findBackupReceivedByDistrictOnThisMonth() {
		return resourceRepository.findBackupReceivedByDistrictOnThisMonth();
	}

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findBackupReceivedOnLast12Months() {
		return resourceRepository.findBackupReceivedOnLast12Months();
	}

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findLastSyncByServer() {
		return resourceRepository.findLastSyncByServer();
	}

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findSyncsOfPreviousWeek() {
		return resourceRepository.findSyncsOfPreviousWeek();
	}

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findSyncsOfThisWeek() {
		return resourceRepository.findSyncsOfThisWeek();
	}

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findSyncsRemainingItemsOfThisWeek() {
		return resourceRepository.findSyncsRemainingItemsOfThisWeek();
	}

	@Transactional(readOnly = true)
	@Override
	public List<Object[]> findSyncsRemainingItemsOfPreviousWeek() {
		return resourceRepository.findSyncsRemainingItemsOfPreviousWeek();
	}

	@Transactional(readOnly = true)
	@Override
	public List<String> findUsersForSendNotification(Long district_id) {
		return resourceRepository.findUsersForSendNotification(district_id);
	}

	@Transactional(readOnly = true)
	@Override
	public List<String> findUsersForReceiveNotification(Long district_id) {
		return resourceRepository.findUsersForReceiveNotification(district_id);
	}

	@Transactional(readOnly = true)
	@Override
	public List<String> findUsersForSyncNotification(Long district_id) {
		return resourceRepository.findUsersForSyncNotification(district_id);
	}

	@Transactional(readOnly = true)
	@Override
	public int findSyncsInProgress() {
		return resourceRepository.findSyncsInProgress();
	}

	@Transactional(readOnly = true)
	@Override
	public int findSyncsInProgressByUser(String username) {
		return resourceRepository.findSyncsInProgressByUser(username);
	}

	@Transactional(readOnly = true)
	@Override
	public int findNumberOfAllBackupsNotReceived() {
		return resourceRepository.findNumberOfAllBackupsNotReceived();
	}

	@Override
	public List<Object[]> findDistrictsInfo() {
		return resourceRepository.findDistrictsInfo();
	}
	
}
