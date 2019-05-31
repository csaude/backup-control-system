package mz.org.fgh.scb.person;

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

import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Entity(name = "person")
public class Person {

	@Id
	@SequenceGenerator(name = "seq_person", initialValue = 1)
	@GeneratedValue(generator = "seq_person", strategy = GenerationType.AUTO)
	@Column(name = "person_id")
	private Long personId;

	@Column(nullable = false, name = "others_names")
	private String othersNames;

	@Column(nullable = false)
	private String surname;

	private String email;

	@Column(name = "phone_number")
	private String phoneNumber;

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

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private PersonGender gender;

	@Column(nullable = false, unique = true, name = "uuid")
	private String uid;

	public Person() {
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getPersonId() {
		return personId;
	}

	public void setPersonId(Long personId) {
		this.personId = personId;
	}

	public String getOthersNames() {
		return othersNames;
	}

	public void setOthersNames(String othersNames) {
		this.othersNames = othersNames;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
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

	public PersonGender getGender() {
		return gender;
	}

	public void setGender(PersonGender gender) {
		this.gender = gender;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((personId == null) ? 0 : personId.hashCode());
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
		Person other = (Person) obj;
		if (personId == null) {
			if (other.personId != null)
				return false;
		} else if (!personId.equals(other.personId))
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
		return "Person [personId=" + personId + ", othersNames=" + othersNames + ", surname=" + surname + ", email=" + email + ", phoneNumber=" + phoneNumber + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated + ", gender="
				+ gender + ", uid=" + uid + "]";
	}

}
