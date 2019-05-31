package mz.org.fgh.scb.resource;

import java.util.List;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface ResourceService {

	// ------------------------------------------------
	// DISTRICT DATA
	// ------------------------------------------------
	/**
	 * @return date of last backup received by District
	 */
	List<Object[]> findDistrictsInfo();

	// ------------------------------------------------
	// BACKUP
	// ------------------------------------------------
	/**
	 * @return number of backups received by District on previous month
	 */
	List<Object[]> findBackupReceivedByDistrictOnPreviousMonth();

	/**
	 * @return number of backups received by District on this month
	 */
	List<Object[]> findBackupReceivedByDistrictOnThisMonth();

	/**
	 * @return number of backups received on the last 12 months
	 */
	List<Object[]> findBackupReceivedOnLast12Months();

	// ----------------------------------------------
	// SYNC
	// ----------------------------------------------
	/**
	 * @return date of last Sync by Server
	 */
	List<Object[]> findLastSyncByServer();

	/**
	 * @return numbers of Syncs ocurred by Server on previous week
	 */
	List<Object[]> findSyncsOfPreviousWeek();

	/**
	 * @return numbers of Syncs ocurred by Server on this week
	 */
	List<Object[]> findSyncsOfThisWeek();

	/**
	 * @return numbers of Syncs ocurred by Server on this week
	 */
	List<Object[]> findSyncsRemainingItemsOfThisWeek();

	/**
	 * @return number of items remaining to send/receive by server on previous week
	 */
	List<Object[]> findSyncsRemainingItemsOfPreviousWeek();

	// ----------------------------------------------
	// NOTIFICATION
	// ----------------------------------------------
	/**
	 * Returns all emails of the given District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	List<String> findUsersForSendNotification(Long district_id);

	/**
	 * Returns all emails of the given District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	List<String> findUsersForReceiveNotification(Long district_id);

	/**
	 * Returns all emails of the given District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	List<String> findUsersForSyncNotification(Long district_id);
	
	/**
	 * Returns all emails of the given District and Regional Coordinators Officers of the given District and all HIS Members
	 * 
	 * @param district_id the District id
	 * @return all emails of District Officers of the given District
	 */
	List<String> findUsersForSyncOccurenceNotification(Long district_id);

	/**
	 * Returns the number of Syncs in progress
	 * 
	 * @return the number of Syncs in progress
	 */
	int findSyncsInProgress();

	/**
	 * Returns the number Syncs in progress on Districts of the given Logged User username
	 * 
	 * @param username the Logged User username
	 * @return the number Syncs in progress on Districts of the given Logged User username
	 */
	int findSyncsInProgressByUser(String username);

	/**
	 * Returns the number of all Sends not received
	 * 
	 * @return the number of all Sends not received
	 */
	int findNumberOfAllBackupsNotReceived();

}
