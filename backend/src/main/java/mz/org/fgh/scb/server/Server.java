package mz.org.fgh.scb.server;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import mz.org.fgh.scb.district.District;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Entity(name = "server")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "name", "district_id" }) })
public class Server {

	@Id
	@SequenceGenerator(name = "seq_server", initialValue = 1)
	@GeneratedValue(generator = "seq_server", strategy = GenerationType.AUTO)
	@Column(name = "server_id")
	private Long serverId;

	@Column(nullable = false)
	private String name;

	@JoinColumn(name = "district_id")
	@ManyToOne
	private District district;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private ServerType type;

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

	public Server() {
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getServerId() {
		return serverId;
	}

	public void setServerId(Long serverId) {
		this.serverId = serverId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public District getDistrict() {
		return district;
	}

	public void setDistrict(District district) {
		this.district = district;
	}

	public ServerType getType() {
		return type;
	}

	public void setType(ServerType type) {
		this.type = type;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((serverId == null) ? 0 : serverId.hashCode());
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
		Server other = (Server) obj;
		if (serverId == null) {
			if (other.serverId != null)
				return false;
		} else if (!serverId.equals(other.serverId))
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
		return "Server [serverId=" + serverId + ", name=" + name + ", type=" + type + ", observation=" + observation + ", uid=" + uid + ", canceled=" + canceled + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated
				+ ", canceledReason=" + canceledReason + ", dateCanceled=" + dateCanceled + "]";
	}

}
