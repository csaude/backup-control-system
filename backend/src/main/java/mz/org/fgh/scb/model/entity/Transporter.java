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
 * @author damasceno.lopes
 *
 */
@Entity(name = "transporter")
@Table(uniqueConstraints={
	    @UniqueConstraint(columnNames = {"name", "phone_number"})})
public class Transporter {

	@Id
	@SequenceGenerator(name = "seq_transporter", initialValue = 1)
	@GeneratedValue(generator = "seq_transporter", strategy = GenerationType.AUTO)
	private Long transporter_id;

	@Column(nullable = false)
	private String name;

	private String phone_number;

	@Column(nullable = false)
	private String role;

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

	@Column(nullable = false, unique = true)
	private String uuid;

	public Transporter() {
		this.canceled = false;
		this.uuid = UUID.randomUUID().toString();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getTransporter_id() {
		return transporter_id;
	}

	public void setTransporter_id(Long transporter_id) {
		this.transporter_id = transporter_id;
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
			created_by.setDistricts(null);
			created_by.setAuthorities(null);
			return created_by;
			}else {
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
			return updated_by;
		} else {
			return null;
		}
	}

	public void setUpdated_by(User updated_by) {
		this.updated_by = updated_by;
	}

	public String getPhone_number() {
		return phone_number;
	}

	public void setPhone_number(String phone_number) {
		this.phone_number = phone_number;
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
			return canceled_by;
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

	@Override
	public String toString() {
		return "Transporter [transporter_id=" + transporter_id + ", name=" + name + ", phone_number=" + phone_number
				+ ", role=" + role + ", date_created=" + date_created + ", date_updated=" + date_updated + ", canceled="
				+ canceled + ", canceled_reason=" + canceled_reason + ", date_canceled=" + date_canceled + ", uuid="
				+ uuid + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((transporter_id == null) ? 0 : transporter_id.hashCode());
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
		Transporter other = (Transporter) obj;
		if (transporter_id == null) {
			if (other.transporter_id != null)
				return false;
		} else if (!transporter_id.equals(other.transporter_id))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}

}
