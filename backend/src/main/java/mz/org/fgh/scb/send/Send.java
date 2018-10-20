/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.send;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import mz.org.fgh.scb.district.District;
import mz.org.fgh.scb.transporter.Transporter;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes
 *
 */
@Entity(name = "send")
public class Send {

	@Id
	@SequenceGenerator(name = "seq_send", initialValue = 1)
	@GeneratedValue(generator = "seq_send", strategy = GenerationType.AUTO)
	@Column(name = "send_id")
	private Long sendId;

	@JoinColumn(name = "district_id")
	@ManyToOne
	private District district;

	@JoinColumn(name = "transporter_id")
	@ManyToOne
	private Transporter transporter;

	@Column(name = "backup_date", nullable = false)
	private Date backupDate;

	@Column(nullable = false, name = "update_finished")
	private boolean updateFinished;

	@Column(nullable = false, name = "validation_finished")
	private boolean validationFinished;

	@Column(nullable = false, name = "sync_finished")
	private boolean syncFinished;

	@Column(nullable = false, name = "cross_dhis2_finished")
	private boolean crossDhis2Finished;

	@Column(nullable = false, name = "cross_idart_finished")
	private boolean crossIdartFinished;

	@Column(nullable = false)
	private boolean received;

	@Column(nullable = false)
	private String observation;

	@Column(nullable = false, unique = true, name = "uuid")
	private String uid;

	@Column(nullable = false)
	private boolean canceled;

	@Column(nullable = false, name = "date_created")
	private Date dateCreated;

	@Column(name = "date_updated")
	private Date dateUpdated;

	@JoinColumn(name = "created_by")
	@ManyToOne
	private User createdBy;

	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updatedBy;

	@Column(name = "canceled_reason")
	private String canceledReason;

	@Column(name = "date_canceled")
	private Date dateCanceled;

	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceledBy;

	@Column(nullable = false, name = "ik_received")
	private boolean ikReceived;

	@Column(name = "date_ik_received")
	private Date dateIkReceived;

	@Column(name = "idart_backup")
	private boolean idartBackup;

	@Column(name = "idart_backup_date")
	private Date idartBackupDate;

	public Send() {
		this.canceled = false;
		this.received = false;
		this.ikReceived = false;
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getSendId() {
		return sendId;
	}

	public void setSendId(Long sendId) {
		this.sendId = sendId;
	}

	public District getDistrict() {
		return district;
	}

	public void setDistrict(District district) {
		this.district = district;
	}

	public Transporter getTransporter() {
		return transporter;
	}

	public void setTransporter(Transporter transporter) {
		this.transporter = transporter;
	}

	public Date getBackupDate() {
		return backupDate;
	}

	public void setBackupDate(Date backupDate) {
		this.backupDate = backupDate;
	}

	public boolean isUpdateFinished() {
		return updateFinished;
	}

	public void setUpdateFinished(boolean updateFinished) {
		this.updateFinished = updateFinished;
	}

	public boolean isValidationFinished() {
		return validationFinished;
	}

	public void setValidationFinished(boolean validationFinished) {
		this.validationFinished = validationFinished;
	}

	public boolean isSyncFinished() {
		return syncFinished;
	}

	public void setSyncFinished(boolean syncFinished) {
		this.syncFinished = syncFinished;
	}

	public boolean isCrossDhis2Finished() {
		return crossDhis2Finished;
	}

	public void setCrossDhis2Finished(boolean crossDhis2Finished) {
		this.crossDhis2Finished = crossDhis2Finished;
	}

	public boolean isCrossIdartFinished() {
		return crossIdartFinished;
	}

	public void setCrossIdartFinished(boolean crossIdartFinished) {
		this.crossIdartFinished = crossIdartFinished;
	}

	public boolean isReceived() {
		return received;
	}

	public void setReceived(boolean received) {
		this.received = received;
	}

	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public boolean isCanceled() {
		return canceled;
	}

	public void setCanceled(boolean canceled) {
		this.canceled = canceled;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public User getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(User updatedBy) {
		this.updatedBy = updatedBy;
	}

	public String getCanceledReason() {
		return canceledReason;
	}

	public void setCanceledReason(String canceledReason) {
		this.canceledReason = canceledReason;
	}

	public Date getDateCanceled() {
		return dateCanceled;
	}

	public void setDateCanceled(Date dateCanceled) {
		this.dateCanceled = dateCanceled;
	}

	public User getCanceledBy() {
		return canceledBy;
	}

	public void setCanceledBy(User canceledBy) {
		this.canceledBy = canceledBy;
	}

	public boolean isIkReceived() {
		return ikReceived;
	}

	public void setIkReceived(boolean ikReceived) {
		this.ikReceived = ikReceived;
	}

	public Date getDateIkReceived() {
		return dateIkReceived;
	}

	public void setDateIkReceived(Date dateIkReceived) {
		this.dateIkReceived = dateIkReceived;
	}

	public boolean isIdartBackup() {
		return idartBackup;
	}

	public void setIdartBackup(boolean idartBackup) {
		this.idartBackup = idartBackup;
	}

	public Date getIdartBackupDate() {
		return idartBackupDate;
	}

	public void setIdartBackupDate(Date idartBackupDate) {
		this.idartBackupDate = idartBackupDate;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((sendId == null) ? 0 : sendId.hashCode());
		result = prime * result + ((uid == null) ? 0 : uid.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Send other = (Send) obj;
		if (sendId == null) {
			if (other.sendId != null)
				return false;
		} else if (!sendId.equals(other.sendId))
			return false;
		if (uid == null) {
			if (other.uid != null)
				return false;
		} else if (!uid.equals(other.uid))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Send [sendId=" + sendId + ", backupDate=" + backupDate + ", updateFinished=" + updateFinished + ", validationFinished=" + validationFinished + ", syncFinished=" + syncFinished + ", crossDhis2Finished=" + crossDhis2Finished
				+ ", crossIdartFinished=" + crossIdartFinished + ", received=" + received + ", observation=" + observation + ", uid=" + uid + ", canceled=" + canceled + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated
				+ ", canceledReason=" + canceledReason + ", dateCanceled=" + dateCanceled + ", ikReceived=" + ikReceived + ", dateIkReceived=" + dateIkReceived + ", idartBackup=" + idartBackup + ", idartBackupDate=" + idartBackupDate + "]";
	}

}
