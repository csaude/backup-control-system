/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.user;

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
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonBackReference;

import io.swagger.annotations.ApiModelProperty;
import mz.org.fgh.scb.authority.Authority;
import mz.org.fgh.scb.district.District;
import mz.org.fgh.scb.person.Person;

/**
 * @author Damasceno Lopes
 *
 */
@Entity(name = "user")
public class User {

	@Id
	@SequenceGenerator(name = "seq_user", initialValue = 1)
	@GeneratedValue(generator = "seq_user", strategy = GenerationType.AUTO)
	@Column(name = "user_id")
	private Long userId;

	@JoinColumn(name = "person_id")
	@OneToOne
	private Person person;

	@Column(unique = true, nullable = false)
	private String username;

	@ApiModelProperty(hidden = true)
	@JsonBackReference(value = "user-password")
	@Column(nullable = false)
	private String password;

	@Column(nullable = false, name = "date_created")
	private Date dateCreated;

	@Column(name = "date_updated")
	private Date dateUpdated;

	@ApiModelProperty(hidden = true)
	@JoinColumn(name = "created_by")
	@ManyToOne
	private User createdBy;

	@ApiModelProperty(hidden = true)
	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updatedBy;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_district", joinColumns = { @JoinColumn(name = "user_id", referencedColumnName = "user_id") }, inverseJoinColumns = {
			@JoinColumn(name = "district_id", referencedColumnName = "district_id") }, uniqueConstraints = { @UniqueConstraint(columnNames = { "user_id", "district_id" }) })
	private Set<District> districts = new HashSet<District>(0);

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_authority", joinColumns = { @JoinColumn(name = "user_id", referencedColumnName = "user_id") }, inverseJoinColumns = {
			@JoinColumn(name = "authority_id", referencedColumnName = "authority_id") }, uniqueConstraints = { @UniqueConstraint(columnNames = { "user_id", "authority_id" }) })
	private Set<Authority> authorities = new HashSet<Authority>(0);;

	private boolean enabled;

	private String locale;

	@Column(nullable = false, unique = true, name = "uuid")
	private String uid;

	@Column(nullable = false)
	private boolean notification;

	@Column(name = "last_login")
	private Date lastLogin;

	public User() {
		this.enabled = true;
		this.notification = true;
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public Set<District> getDistricts() {
		return districts;
	}

	public void setDistricts(Set<District> districts) {
		this.districts = districts;
	}

	public Set<Authority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Set<Authority> authorities) {
		this.authorities = authorities;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getLocale() {
		return locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public boolean isNotification() {
		return notification;
	}

	public void setNotification(boolean notification) {
		this.notification = notification;
	}

	public Date getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}

	public String getPersonName() {
		return person.getOthersNames() + " " + person.getSurname();
	}

	public String getCreatorName() {
		return this.getCreatedBy().getPerson().getOthersNames() + " " + this.getCreatedBy().getPerson().getSurname();
	}

	public String getUpdaterName() {
		if (this.getUpdatedBy() == null)
			return null;
		else
			return this.getUpdatedBy().getPerson().getOthersNames() + " " + this.getUpdatedBy().getPerson().getSurname();
	}

	public Long getCreatorId() {
		return this.getCreatedBy().getUserId();
	}

	public Long getUpdaterId() {
		if (this.getUpdatedBy() == null)
			return null;
		else
			return this.getUpdatedBy().getUserId();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((uid == null) ? 0 : uid.hashCode());
		result = prime * result + ((userId == null) ? 0 : userId.hashCode());
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
		User other = (User) obj;
		if (uid == null) {
			if (other.uid != null)
				return false;
		} else if (!uid.equals(other.uid))
			return false;
		if (userId == null) {
			if (other.userId != null)
				return false;
		} else if (!userId.equals(other.userId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "User [userId=" + userId + ", username=" + username + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated + ", enabled=" + enabled + ", locale=" + locale + ", uid=" + uid + ", notification=" + notification
				+ ", lastLogin=" + lastLogin + "]";
	}

}
