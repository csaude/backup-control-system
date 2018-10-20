/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.sync;

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

import io.swagger.annotations.ApiModelProperty;
import mz.org.fgh.scb.district.District;
import mz.org.fgh.scb.server.Server;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes
 *
 */
@Entity(name = "sync")
public class Sync {

	@Id
	@SequenceGenerator(name = "seq_sync", initialValue = 1)
	@GeneratedValue(generator = "seq_sync", strategy = GenerationType.AUTO)
	@Column(name = "sync_id")
	private Long syncId;

	@JoinColumn(name = "server_id")
	@ManyToOne
	private Server server;

	@JoinColumn(name = "district_id")
	@ManyToOne
	private District district;

	@Column(name = "start_time", nullable = false)
	private Date startTime;

	@Column(name = "start_items_to_send", nullable = false)
	private int startItemsToSend;

	@Column(name = "start_items_to_receive", nullable = false)
	private int startItemsToReceive;

	@Column(name = "end_time", nullable = true)
	private Date endTime;

	@Column(name = "end_items_to_send", nullable = true)
	private int endItemsToSend;

	@Column(name = "end_items_to_receive", nullable = true)
	private int endItemsToReceive;

	private String observation;

	@Column(name = "observation_his")
	private String observationHis;

	@Column(nullable = false)
	private boolean canceled;

	@Column(nullable = false, unique = true, name = "uuid")
	private String uid;

	@Column(name = "sync_error", nullable = false)
	private boolean syncError;

	@Column(name = "serverfault", nullable = false)
	private boolean serverFault;

	@Column(name = "laptopfault", nullable = false)
	private boolean laptopFault;

	@Column(nullable = false, name = "powercut")
	private boolean powerCut;

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

	@ApiModelProperty(hidden = true)
	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceledBy;

	public Sync() {
		this.canceled = false;
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getSyncId() {
		return syncId;
	}

	public void setSyncId(Long syncId) {
		this.syncId = syncId;
	}

	public Server getServer() {
		return server;
	}

	public void setServer(Server server) {
		this.server = server;
	}

	public District getDistrict() {
		return district;
	}

	public void setDistrict(District district) {
		this.district = district;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public int getStartItemsToSend() {
		return startItemsToSend;
	}

	public void setStartItemsToSend(int startItemsToSend) {
		this.startItemsToSend = startItemsToSend;
	}

	public int getStartItemsToReceive() {
		return startItemsToReceive;
	}

	public void setStartItemsToReceive(int startItemsToReceive) {
		this.startItemsToReceive = startItemsToReceive;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public int getEndItemsToSend() {
		return endItemsToSend;
	}

	public void setEndItemsToSend(int endItemsToSend) {
		this.endItemsToSend = endItemsToSend;
	}

	public int getEndItemsToReceive() {
		return endItemsToReceive;
	}

	public void setEndItemsToReceive(int endItemsToReceive) {
		this.endItemsToReceive = endItemsToReceive;
	}

	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
	}

	public String getObservationHis() {
		return observationHis;
	}

	public void setObservationHis(String observationHis) {
		this.observationHis = observationHis;
	}

	public boolean isCanceled() {
		return canceled;
	}

	public void setCanceled(boolean canceled) {
		this.canceled = canceled;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public boolean isSyncError() {
		return syncError;
	}

	public void setSyncError(boolean syncError) {
		this.syncError = syncError;
	}

	public boolean isServerFault() {
		return serverFault;
	}

	public void setServerFault(boolean serverFault) {
		this.serverFault = serverFault;
	}

	public boolean isLaptopFault() {
		return laptopFault;
	}

	public void setLaptopFault(boolean laptopFault) {
		this.laptopFault = laptopFault;
	}

	public boolean isPowerCut() {
		return powerCut;
	}

	public void setPowerCut(boolean powerCut) {
		this.powerCut = powerCut;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((syncId == null) ? 0 : syncId.hashCode());
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
		Sync other = (Sync) obj;
		if (syncId == null) {
			if (other.syncId != null)
				return false;
		} else if (!syncId.equals(other.syncId))
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
		return "Sync [syncId=" + syncId + ", startTime=" + startTime + ", startItemsToSend=" + startItemsToSend + ", startItemsToReceive=" + startItemsToReceive + ", endTime=" + endTime + ", endItemsToSend=" + endItemsToSend
				+ ", endItemsToReceive=" + endItemsToReceive + ", observation=" + observation + ", observationHis=" + observationHis + ", canceled=" + canceled + ", uid=" + uid + ", syncError=" + syncError + ", serverFault=" + serverFault
				+ ", laptopFault=" + laptopFault + ", powerCut=" + powerCut + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated + ", canceledReason=" + canceledReason + ", dateCanceled=" + dateCanceled + "]";
	}

}
