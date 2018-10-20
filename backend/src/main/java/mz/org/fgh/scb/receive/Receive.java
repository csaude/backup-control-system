/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.receive;

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

import mz.org.fgh.scb.send.Send;
import mz.org.fgh.scb.transporter.Transporter;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes
 *
 */
@Entity(name = "receive")
public class Receive {

	@Id
	@SequenceGenerator(name = "seq_receive", initialValue = 1)
	@GeneratedValue(generator = "seq_receive", strategy = GenerationType.AUTO)
	@Column(name = "receive_id")
	private Long receiveId;

	@JoinColumn(name = "send_id")
	@ManyToOne
	private Send send;

	@Column(nullable = false, name = "receive_date")
	private Date receiveDate;

	private String observation;

	@Column(nullable = false, name = "ik_returned")
	private boolean ikReturned;

	@Column(name = "date_ik_returned")
	private Date dateIkReturned;

	@JoinColumn(name = "transporter_id")
	@ManyToOne
	private Transporter transporter;

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

	@Column(name = "date_restored")
	private Date dateRestored;

	@Column(nullable = false)
	private boolean restored;

	@JoinColumn(name = "restored_by")
	@ManyToOne
	private User restoredBy;

	@JoinColumn(name = "ik_returned_by")
	@ManyToOne
	private User ikReturnedBy;

	public Receive() {
		this.canceled = false;
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getReceiveId() {
		return receiveId;
	}

	public void setReceiveId(Long receiveId) {
		this.receiveId = receiveId;
	}

	public Send getSend() {
		return send;
	}

	public void setSend(Send send) {
		this.send = send;
	}

	public Date getReceiveDate() {
		return receiveDate;
	}

	public void setReceiveDate(Date receiveDate) {
		this.receiveDate = receiveDate;
	}

	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
	}

	public boolean isIkReturned() {
		return ikReturned;
	}

	public void setIkReturned(boolean ikReturned) {
		this.ikReturned = ikReturned;
	}

	public Date getDateIkReturned() {
		return dateIkReturned;
	}

	public void setDateIkReturned(Date dateIkReturned) {
		this.dateIkReturned = dateIkReturned;
	}

	public Transporter getTransporter() {
		return transporter;
	}

	public void setTransporter(Transporter transporter) {
		this.transporter = transporter;
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

	public Date getDateRestored() {
		return dateRestored;
	}

	public void setDateRestored(Date dateRestored) {
		this.dateRestored = dateRestored;
	}

	public boolean isRestored() {
		return restored;
	}

	public void setRestored(boolean restored) {
		this.restored = restored;
	}

	public User getRestoredBy() {
		return restoredBy;
	}

	public void setRestoredBy(User restoredBy) {
		this.restoredBy = restoredBy;
	}

	public User getIkReturnedBy() {
		return ikReturnedBy;
	}

	public void setIkReturnedBy(User ikReturnedBy) {
		this.ikReturnedBy = ikReturnedBy;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((receiveId == null) ? 0 : receiveId.hashCode());
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
		Receive other = (Receive) obj;
		if (receiveId == null) {
			if (other.receiveId != null)
				return false;
		} else if (!receiveId.equals(other.receiveId))
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
		return "Receive [receiveId=" + receiveId + ", receiveDate=" + receiveDate + ", observation=" + observation + ", ikReturned=" + ikReturned + ", dateIkReturned=" + dateIkReturned + ", uid=" + uid + ", canceled=" + canceled
				+ ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated + ", canceledReason=" + canceledReason + ", dateCanceled=" + dateCanceled + ", dateRestored=" + dateRestored + ", restored=" + restored + "]";
	}

}
