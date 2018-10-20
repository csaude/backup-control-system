/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.district;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import io.swagger.annotations.ApiModelProperty;
import mz.org.fgh.scb.ironkey.Ironkey;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes
 *
 */
@Entity(name = "district")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "province", "name" }) })
public class District {

	@Id
	@SequenceGenerator(name = "seq_district", initialValue = 1)
	@GeneratedValue(generator = "seq_district", strategy = GenerationType.AUTO)
	@Column(name = "district_id")
	private Long districtId;

	@Column(nullable = false)
	private String province;

	@Column(nullable = false)
	private String name;

	@Column(name = "instance_url")
	private String instanceUrl;

	@Column(name = "instance_username")
	private String instanceUsername;

	@Column(name = "instance_password")
	private String instancePassword;

	@ApiModelProperty(hidden = true)
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "district_ironkey", joinColumns = { @JoinColumn(name = "district_id", nullable = false, updatable = false) }, inverseJoinColumns = {
			@JoinColumn(name = "ironkey_id", nullable = false, updatable = false) }, uniqueConstraints = { @UniqueConstraint(columnNames = { "district_id", "ironkey_id" }) })
	private Set<Ironkey> ironkeys = new HashSet<Ironkey>(0);

	@ApiModelProperty(hidden = true)
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "districts")
	private Set<User> users = new HashSet<User>(0);

	@Column(nullable = false, unique = true, name = "uuid")
	private String uid;

	@Column(nullable = false)
	private boolean canceled;

	@Column(name = "canceled_reason")
	private String canceledReason;

	@ApiModelProperty(hidden = true)
	@JoinColumn(name = "parent_id")
	@ManyToOne
	private District parent;

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

	@Column(name = "date_canceled")
	private Date dateCanceled;

	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceledBy;

	public District() {
		this.canceled = false;
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getDistrictId() {
		return districtId;
	}

	public void setDistrictId(Long districtId) {
		this.districtId = districtId;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInstanceUrl() {
		return instanceUrl;
	}

	public void setInstanceUrl(String instanceUrl) {
		this.instanceUrl = instanceUrl;
	}

	public String getInstanceUsername() {
		return instanceUsername;
	}

	public void setInstanceUsername(String instanceUsername) {
		this.instanceUsername = instanceUsername;
	}

	public String getInstancePassword() {
		return instancePassword;
	}

	public void setInstancePassword(String instancePassword) {
		this.instancePassword = instancePassword;
	}

	public Set<Ironkey> getIronkeys() {
		return ironkeys;
	}

	public void setIronkeys(Set<Ironkey> ironkeys) {
		this.ironkeys = ironkeys;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
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

	public String getCanceledReason() {
		return canceledReason;
	}

	public void setCanceledReason(String canceledReason) {
		this.canceledReason = canceledReason;
	}

	public District getParent() {
		return parent;
	}

	public void setParent(District parent) {
		this.parent = parent;
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

	public String getFullName() {
		if (parent == null)
			return name;
		else
			return parent.getName() + " / " + name;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((districtId == null) ? 0 : districtId.hashCode());
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
		District other = (District) obj;
		if (districtId == null) {
			if (other.districtId != null)
				return false;
		} else if (!districtId.equals(other.districtId))
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
		return "District [districtId=" + districtId + ", province=" + province + ", name=" + name + ", instanceUrl=" + instanceUrl + ", instanceUsername=" + instanceUsername + ", instancePassword=" + instancePassword + ", uid=" + uid
				+ ", canceled=" + canceled + ", canceledReason=" + canceledReason + ", parent=" + parent + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated + ", dateCanceled=" + dateCanceled + "]";
	}

}
