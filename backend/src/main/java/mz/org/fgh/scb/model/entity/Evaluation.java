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
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.validator.constraints.NotBlank;

/**
 * A Evaluation is a definition of OpenMRS SQL dataset wich 
 * allows the user to perform queries on the databse on this 
 * System are beeing used to do database QA.
 * 
 * @author Damasceno Lopes
 *
 */
@Entity(name = "evaluation")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "name", "openmrs_sql_dataset_uuid" }) })
public class Evaluation {

	/**
	 * The Evaluation id
	 */
	@Id
	@SequenceGenerator(name = "seq_evaluation", initialValue = 1)
	@GeneratedValue(generator = "seq_evaluation", strategy = GenerationType.AUTO)
	private Long evaluation_id;

	/**
	 * The Evaluation name
	 */
	@Column(nullable = false)
	@NotBlank
	private String name;

	/**
	 * The Evaluation openmrs sql dataset uuid
	 */
	@Column(nullable = false)
	@NotBlank
	private String openmrs_sql_dataset_uuid;

	/**
	 * The Evaluation description
	 */
	private String description;

	/**
	 * The Evaluation date created
	 */
	@Column(nullable = false)
	private Date date_created;

	/**
	 * The Evaluation date updated
	 */
	private Date date_updated;

	/**
	 * The User that created this Evaluation {@link User}
	 */
	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	/**
	 * The User that updated this Evaluation {@link User}
	 */
	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	/**
	 * The Evaluation uuid
	 */
	@Column(nullable = false, unique = true)
	private String uuid;

	// -------------------------------------------------
	// Constructors
	// -------------------------------------------------
	public Evaluation() {
		this.uuid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getEvaluation_id() {
		return evaluation_id;
	}

	public void setEvaluation_id(Long evaluation_id) {
		this.evaluation_id = evaluation_id;
	}

	public String getOpenmrs_sql_dataset_uuid() {
		return openmrs_sql_dataset_uuid;
	}

	public void setOpenmrs_sql_dataset_uuid(String openmrs_sql_dataset_uuid) {
		this.openmrs_sql_dataset_uuid = openmrs_sql_dataset_uuid;
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

	@Override
	public String toString() {
		return "Evaluation [evaluation_id=" + evaluation_id + ", name=" + name + ", openmrs_sql_dataset_uuid=" + openmrs_sql_dataset_uuid + ", description=" + description + ", date_created=" + date_created + ", date_updated=" + date_updated
				+ ", uuid=" + uuid + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((evaluation_id == null) ? 0 : evaluation_id.hashCode());
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
		Evaluation other = (Evaluation) obj;
		if (evaluation_id == null) {
			if (other.evaluation_id != null)
				return false;
		} else if (!evaluation_id.equals(other.evaluation_id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}

}
