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
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * @author damasceno.lopes
 *
 */
@Entity(name = "person")
public class Person {

	@Id
	@SequenceGenerator(name = "seq_person", initialValue = 1)
	@GeneratedValue(generator = "seq_person", strategy = GenerationType.AUTO)
	private Long person_id;

	@Column(nullable = false)
	private String others_names;

	@Column(nullable = false)
	private String surname;

	private String email;

	private String phone_number;

	@Column(nullable = false)
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date date_created;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date date_updated;

	@JsonBackReference(value = "person-created_by")
	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	@JsonBackReference(value = "person-updated_by")
	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	@Column(nullable = false)
	private char gender;

	@Column(nullable = false, unique = true)
	private String uuid;

	public Person() {
		this.uuid = UUID.randomUUID().toString();
	}

	public Long getPerson_id() {
		return person_id;
	}

	public void setPerson_id(Long person_id) {
		this.person_id = person_id;
	}

	public String getOthers_names() {
		return others_names;
	}

	public void setOthers_names(String others_names) {
		this.others_names = others_names;
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

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getPhone_number() {
		return phone_number;
	}

	public void setPhone_number(String phone_number) {
		this.phone_number = phone_number;
	}

	public char getGender() {
		return gender;
	}

	public void setGender(char gender) {
		this.gender = gender;
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
		return created_by;
	}

	public void setCreated_by(User created_by) {
		this.created_by = created_by;
	}

	public User getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(User updated_by) {
		this.updated_by = updated_by;
	}

	@Override
	public String toString() {
		return "Person [person_id=" + person_id + ", others_names=" + others_names + ", surname=" + surname + ", email="
				+ email + ", phone_number=" + phone_number + ", date_created=" + date_created + ", date_updated="
				+ date_updated + ", gender=" + gender + ", uuid=" + uuid + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((person_id == null) ? 0 : person_id.hashCode());
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
		Person other = (Person) obj;
		if (person_id == null) {
			if (other.person_id != null)
				return false;
		} else if (!person_id.equals(other.person_id))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}
	
	

}