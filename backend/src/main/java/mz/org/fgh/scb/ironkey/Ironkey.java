package mz.org.fgh.scb.ironkey;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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

import io.swagger.annotations.ApiModelProperty;
import mz.org.fgh.scb.district.District;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Entity(name = "ironkey")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "serial", "version" }) })
public class Ironkey {

	@Id
	@SequenceGenerator(name = "seq_ironkey", initialValue = 1)
	@GeneratedValue(generator = "seq_ironkey", strategy = GenerationType.AUTO)
	@Column(name = "ironkey_id")
	private Long ironkeyId;

	@Column(nullable = false)
	private String serial;

	@Column(nullable = false)
	private int size;

	@Column(nullable = false)
	private String version;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private IronkeyStatus status;

	@Column(name = "date_purchased")
	private Date datePurchased;

	private String observation;

	@Column(nullable = false, unique = true, name = "uuid")
	private String uid;

	@ApiModelProperty(hidden = true)
	@ManyToMany(fetch = FetchType.EAGER, mappedBy = "ironkeys")
	private Set<District> districts = new HashSet<District>(0);

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

	public Ironkey() {
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getIronkeyId() {
		return ironkeyId;
	}

	public void setIronkeyId(Long ironkeyId) {
		this.ironkeyId = ironkeyId;
	}

	public String getSerial() {
		return serial;
	}

	public void setSerial(String serial) {
		this.serial = serial;
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

	public IronkeyStatus getStatus() {
		return status;
	}

	public void setStatus(IronkeyStatus status) {
		this.status = status;
	}

	public Date getDatePurchased() {
		return datePurchased;
	}

	public void setDatePurchased(Date datePurchased) {
		this.datePurchased = datePurchased;
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

	public Set<District> getDistricts() {
		return districts;
	}

	public void setDistricts(Set<District> districts) {
		this.districts = districts;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((ironkeyId == null) ? 0 : ironkeyId.hashCode());
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
		Ironkey other = (Ironkey) obj;
		if (ironkeyId == null) {
			if (other.ironkeyId != null)
				return false;
		} else if (!ironkeyId.equals(other.ironkeyId))
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
		return "Ironkey [ironkeyId=" + ironkeyId + ", serial=" + serial + ", size=" + size + ", version=" + version + ", status=" + status + ", datePurchased=" + datePurchased + ", observation=" + observation + ", uid=" + uid
				+ ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated + "]";
	}

}
