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

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * A Send is a definition of all backups that 
 * have been Send to Headquarter.
 * 
 * @author Damasceno Lopes
 *
 */
@Entity(name = "send")
public class Send {

	@Id
	@SequenceGenerator(name = "seq_send", initialValue = 1)
	@GeneratedValue(generator = "seq_send", strategy = GenerationType.AUTO)
	private Long send_id;

	@JoinColumn(name = "district_id")
	@ManyToOne
	private District district;

	@JoinColumn(name = "transporter_id")
	@ManyToOne
	private Transporter transporter;

	@Column(name="backup_date",nullable = false)
	private Date backupdate;

	@Column(nullable = false)
	private boolean update_finished;

	@Column(nullable = false)
	private boolean validation_finished;

	@Column(nullable = false)
	private boolean sync_finished;

	@Column(nullable = false)
	private boolean cross_dhis2_finished;

	@Column(nullable = false)
	private boolean cross_idart_finished;

	@Column(nullable = false)
	private boolean received;

	@Column(nullable = false)
	private String observation;

	@Column(nullable = false)
	private Date date_created;

	private Date date_updated;

	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	@Column(nullable = false, unique = true)
	private String uuid;

	private Date date_canceled;

	@Column(nullable = false)
	private boolean canceled;

	private String canceled_reason;

	@JsonBackReference(value = "send-canceled_by")
	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceled_by;

	@Column(nullable = false)
	private boolean ik_received;

	private Date date_ik_received;
	
	/**
	 * Indicates if iDART backup is included
	 */
	private boolean idart_backup;
	
	private Date idart_backup_date;

	// -------------------------------------------------
	// Constructors
	// -------------------------------------------------
	public Send() {
		this.canceled = false;
		this.received = false;
		this.ik_received = false;
		this.uuid = UUID.randomUUID().toString();
	}

	public Long getSend_id() {
		return send_id;
	}

	public void setSend_id(Long send_id) {
		this.send_id = send_id;
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

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public User getCreated_by() {
		if (this.created_by != null) {
			this.created_by.setDistricts(null);
			this.created_by.setAuthorities(null);
			return this.created_by;
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

	public User getCanceled_by() {
		if (this.canceled_by != null) {
			this.canceled_by.setDistricts(null);
			this.canceled_by.setAuthorities(null);
			return this.canceled_by;
		} else {
			return null;
		}
	}

	public void setCanceled_by(User canceled_by) {
		this.canceled_by = canceled_by;
	}

	public Date getDate_canceled() {
		return date_canceled;
	}

	public void setDate_canceled(Date date_canceled) {
		this.date_canceled = date_canceled;
	}

	public Date getBackup_date() {
		return backupdate;
	}

	public void setBackup_date(Date backup_date) {
		this.backupdate = backup_date;
	}

	public District getDistrict() {
		district.setIronkeys(null);
		district.setCreated_by(null);
		district.setUpdated_by(null);
		return district;
	}

	public void setDistrict(District district) {
		this.district = district;
	}

	public Transporter getTransporter() {
		transporter.setCreated_by(null);
		transporter.setUpdated_by(null);
		return transporter;
	}

	public void setTransporter(Transporter transporter) {
		this.transporter = transporter;
	}

	public boolean isUpdate_finished() {
		return update_finished;
	}

	public void setUpdate_finished(boolean update_finished) {
		this.update_finished = update_finished;
	}

	public boolean isValidation_finished() {
		return validation_finished;
	}

	public void setValidation_finished(boolean validation_finished) {
		this.validation_finished = validation_finished;
	}

	public boolean isSync_finished() {
		return sync_finished;
	}

	public void setSync_finished(boolean sync_finished) {
		this.sync_finished = sync_finished;
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

	public boolean isCross_dhis2_finished() {
		return cross_dhis2_finished;
	}

	public void setCross_dhis2_finished(boolean cross_dhis2_finished) {
		this.cross_dhis2_finished = cross_dhis2_finished;
	}

	public boolean isCross_idart_finished() {
		return cross_idart_finished;
	}

	public void setCross_idart_finished(boolean cross_idart_finished) {
		this.cross_idart_finished = cross_idart_finished;
	}

	public String getTransporter_f() {
		return transporter.getName() + ", " + transporter.getPhone_number();
	}

	public boolean isIk_received() {
		return ik_received;
	}

	public void setIk_received(boolean ik_received) {
		this.ik_received = ik_received;
	}

	public Date getDate_ik_received() {
		return date_ik_received;
	}

	public void setDate_ik_received(Date date_ik_received) {
		this.date_ik_received = date_ik_received;
	}

	public boolean isIdart_backup() {
		return idart_backup;
	}

	public void setIdart_backup(boolean idart_backup) {
		this.idart_backup = idart_backup;
	}

	public Date getIdart_backup_date() {
		return idart_backup_date;
	}

	public void setIdart_backup_date(Date idart_backup_date) {
		this.idart_backup_date = idart_backup_date;
	}

	@Override
	public String toString() {
		return "Send [send_id=" + send_id + ", backup_date=" + backupdate + ", update_finished=" + update_finished + ", validation_finished=" + validation_finished + ", sync_finished=" + sync_finished + ", cross_dhis2_finished="
				+ cross_dhis2_finished + ", cross_idart_finished=" + cross_idart_finished + ", received=" + received + ", observation=" + observation + ", date_created=" + date_created + ", date_updated=" + date_updated + ", uuid=" + uuid
				+ ", date_canceled=" + date_canceled + ", canceled=" + canceled + ", canceled_reason=" + canceled_reason + ", ik_received=" + ik_received + ", date_ik_received=" + date_ik_received + ", idart_backup=" + idart_backup
				+ ", idart_backup_date=" + idart_backup_date + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((send_id == null) ? 0 : send_id.hashCode());
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
		Send other = (Send) obj;
		if (send_id == null) {
			if (other.send_id != null)
				return false;
		} else if (!send_id.equals(other.send_id))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}

}
