package mz.org.fgh.scb.transporter;

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

import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Entity(name = "transporter")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "name", "phone_number" }) })
public class Transporter {

	@Id
	@SequenceGenerator(name = "seq_transporter", initialValue = 1)
	@GeneratedValue(generator = "seq_transporter", strategy = GenerationType.AUTO)
	@Column(name = "transporter_id")
	private Long transporterId;

	@Column(nullable = false)
	private String name;

	@Column(name = "phone_number")
	private String phoneNumber;

	@Column(nullable = false)
	private String role;

	@Column(nullable = false)
	private boolean canceled;

	@Column(nullable = false, unique = true, name = "uuid")
	private String uid;

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

	public Transporter() {
		this.canceled = false;
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getTransporterId() {
		return transporterId;
	}

	public void setTransporterId(Long transporterId) {
		this.transporterId = transporterId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
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
		result = prime * result + ((transporterId == null) ? 0 : transporterId.hashCode());
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
		Transporter other = (Transporter) obj;
		if (transporterId == null) {
			if (other.transporterId != null)
				return false;
		} else if (!transporterId.equals(other.transporterId))
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
		return "Transporter [transporterId=" + transporterId + ", name=" + name + ", phoneNumber=" + phoneNumber + ", role=" + role + ", canceled=" + canceled + ", uid=" + uid + ", dateCreated=" + dateCreated + ", dateUpdated="
				+ dateUpdated + ", canceledReason=" + canceledReason + ", dateCanceled=" + dateCanceled + "]";
	}

}
