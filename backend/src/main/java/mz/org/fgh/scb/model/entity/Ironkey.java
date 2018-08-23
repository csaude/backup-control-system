/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.model.entity;

import java.text.SimpleDateFormat;
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
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * A Ironkey is a definition of storage device that is 
 * used to carry the backups from Districts to Headquarters.
 * 
 * @author Damasceno Lopes
 *
 */
@Entity(name = "ironkey")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "serial", "version" }) })
public class Ironkey {

	@Id
	@SequenceGenerator(name = "seq_ironkey", initialValue = 1)
	@GeneratedValue(generator = "seq_ironkey", strategy = GenerationType.AUTO)
	private Long ironkey_id;

	@Column(nullable = false)
	private String serial;

	@Column(nullable = false)
	private int size;

	@Column(nullable = false)
	private String version;

	@Column(nullable = false)
	private String status;

	private Date date_purchased;

	private String observation;

	@Column(nullable = false, unique = true)
	private String uuid;

	@JsonBackReference(value = "ironkeys-districts")
	@ManyToMany(fetch = FetchType.EAGER, mappedBy = "ironkeys")
	private Set<District> districts = new HashSet<District>(0);

	@Column(nullable = false)
	private Date date_created;

	private Date date_updated;

	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	// -------------------------------------------------
	// Constructors
	// -------------------------------------------------
	public Ironkey() {
		this.uuid = UUID.randomUUID().toString();
	}

	public Long getIronkey_id() {
		return ironkey_id;
	}

	public void setIronkey_id(Long ironkey_id) {
		this.ironkey_id = ironkey_id;
	}

	public String getSerial() {
		return serial;
	}

	public void setSerial(String serial) {
		this.serial = serial;
	}

	public String getObservation() {
		return observation;
	}

	public String getObservationf() {
		if (this.observation == null)
			return "";
		else
			return observation;
	}

	public String getLastupdate() {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		if (this.getUpdated_by() == null) {
			if (this.getCreated_by() == null)
				return "";
			else
				return this.getCreated_by().getPerson().getOthers_names() + "\n" + this.getCreated_by().getPerson().getSurname() + "\n" + sdf.format(this.getDate_created());
		} else {
			return this.getUpdated_by().getPerson().getOthers_names() + "\n" + this.getUpdated_by().getPerson().getSurname() + "\n" + sdf.format(this.getDate_updated());
		}
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

	public Set<District> getDistricts() {
		return districts;
	}

	public void setDistricts(Set<District> districts) {
		this.districts = districts;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Date getDate_purchased() {
		return date_purchased;
	}

	public void setDate_purchased(Date date_purchased) {
		this.date_purchased = date_purchased;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSized() {
		return size + " GB";
	}

	@Override
	public String toString() {
		return "Ironkey [ironkey_id=" + ironkey_id + ", serial=" + serial + ", size=" + size + ", version=" + version + ", status=" + status + ", date_purchased=" + date_purchased + ", observation=" + observation + ", uuid=" + uuid
				+ ", date_created=" + date_created + ", date_updated=" + date_updated + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((ironkey_id == null) ? 0 : ironkey_id.hashCode());
		result = prime * result + ((serial == null) ? 0 : serial.hashCode());
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
		Ironkey other = (Ironkey) obj;
		if (ironkey_id == null) {
			if (other.ironkey_id != null)
				return false;
		} else if (!ironkey_id.equals(other.ironkey_id))
			return false;
		if (serial == null) {
			if (other.serial != null)
				return false;
		} else if (!serial.equals(other.serial))
			return false;
		return true;
	}

}
