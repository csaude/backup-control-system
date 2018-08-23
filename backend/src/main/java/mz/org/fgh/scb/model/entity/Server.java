/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.model.entity;

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
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * A Server is a definition of all Sync Computers that 
 * Send and receive data from a Parent Server
 * 
 * @author Damasceno Lopes
 *
 */
@Entity(name = "server")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "name", "district_id" }) })
public class Server {

	@Id
	@SequenceGenerator(name = "seq_server", initialValue = 1)
	@GeneratedValue(generator = "seq_server", strategy = GenerationType.AUTO)
	private Long server_id;

	@Column(nullable = false)
	private String name;

	@JoinColumn(name = "district_id")
	@ManyToOne
	private District district;

	@Column(nullable = false)
	private String type;

	private String observation;

	@Column(nullable = false, unique = true)
	private String uuid;

	@Column(nullable = false)
	private Date date_created;

	private Date date_updated;

	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	@Column(nullable = false)
	private boolean canceled;

	private String canceled_reason;

	private Date date_canceled;

	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceled_by;

	// -------------------------------------------------
	// Constructors
	// -------------------------------------------------
	public Server() {
		this.uuid = UUID.randomUUID().toString();
	}

	public Long getServer_id() {
		return server_id;
	}

	public void setServer_id(Long server_id) {
		this.server_id = server_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Date getDate_created() {
		return date_created;
	}

	public void setDate_created(Date date_created) {
		this.date_created = date_created;
	}

	public Date getDate_updated() {
		return date_updated;
	}

	public void setDate_updated(Date date_updated) {
		this.date_updated = date_updated;
	}

	public User getCreated_by() {
		if (this.created_by != null) {
			created_by.setDistricts(null);
			created_by.setAuthorities(null);
			return created_by;
		} else {
			return null;
		}
	}

	public void setCreated_by(User created_by) {
		this.created_by = created_by;
	}

	public User getUpdated_by() {
		if (this.updated_by != null) {
			this.updated_by.setDistricts(null);
			this.updated_by.setAuthorities(null);
			return this.updated_by;
		} else {
			return null;
		}
	}

	public void setUpdated_by(User updated_by) {
		this.updated_by = updated_by;
	}

	public boolean isCanceled() {
		return canceled;
	}

	public void setCanceled(boolean canceled) {
		this.canceled = canceled;
	}

	public String getCanceled_reason() {
		return canceled_reason;
	}

	public void setCanceled_reason(String canceled_reason) {
		this.canceled_reason = canceled_reason;
	}

	public Date getDate_canceled() {
		return date_canceled;
	}

	public void setDate_canceled(Date date_canceled) {
		this.date_canceled = date_canceled;
	}

	public User getCanceled_by() {
		return canceled_by;
	}

	public void setCanceled_by(User canceled_by) {
		this.canceled_by = canceled_by;
	}

	public District getDistrict() {
		district.setCreated_by(null);
		district.setUpdated_by(null);
		return district;
	}

	public String getDistrictname() {
		return district.getName();
	}

	public void setDistrict(District district) {
		this.district = district;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "Server [server_id=" + server_id + ", name=" + name + ", observation=" + observation + ", uuid=" + uuid + ", date_created=" + date_created + ", date_updated=" + date_updated + ", canceled=" + canceled + ", canceled_reason="
				+ canceled_reason + ", date_canceled=" + date_canceled + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((server_id == null) ? 0 : server_id.hashCode());
		result = prime * result + ((uuid == null) ? 0 : uuid.hashCode());
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
		Server other = (Server) obj;
		if (server_id == null) {
			if (other.server_id != null)
				return false;
		} else if (!server_id.equals(other.server_id))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}

}
