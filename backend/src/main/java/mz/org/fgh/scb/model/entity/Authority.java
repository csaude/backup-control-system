/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.model.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;

import com.fasterxml.jackson.annotation.JsonBackReference;

import io.swagger.annotations.ApiModelProperty;

/**
 * A Authority is a definition of the User previleges on the System.
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Entity(name = "authority")
public class Authority {

	/**
	 * The Authority id
	 */
	@Id
	@SequenceGenerator(name = "seq_authority", initialValue = 1)
	@GeneratedValue(generator = "seq_authority", strategy = GenerationType.AUTO)
	private Long authority_id;

	/**
	 * The Authority name
	 */
	@Column(nullable = false, unique = true)
	private String name;

	/**
	 * The Authority description
	 */
	private String description;

	/**
	 * Users using this Authority
	 */
	@ApiModelProperty(hidden = true)
	@JsonBackReference(value = "user-authorities")
	@ManyToMany(fetch = FetchType.EAGER, mappedBy = "authorities")
	private Set<User> users = new HashSet<User>(0);

	// -------------------------------------------------
	// Constructors
	// -------------------------------------------------
	public Authority() {

	}

	public Long getAuthority_id() {
		return authority_id;
	}

	public void setAuthority_id(Long authority_id) {
		this.authority_id = authority_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		return "Authority [authority_id=" + authority_id + ", name=" + name + ", description=" + description + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((authority_id == null) ? 0 : authority_id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
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
		Authority other = (Authority) obj;
		if (authority_id == null) {
			if (other.authority_id != null)
				return false;
		} else if (!authority_id.equals(other.authority_id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}

}
