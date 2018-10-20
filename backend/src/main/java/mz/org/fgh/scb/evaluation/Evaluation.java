/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.evaluation;

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
 * @author Damasceno Lopes
 *
 */
@Entity(name = "evaluation")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "name", "openmrs_sql_dataset_uuid" }) })
public class Evaluation {

	@Id
	@SequenceGenerator(name = "seq_evaluation", initialValue = 1)
	@GeneratedValue(generator = "seq_evaluation", strategy = GenerationType.AUTO)
	@Column(name = "evaluation_id")
	private Long evaluationId;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, name = "openmrs_sql_dataset_uuid")
	private String openmrsSqlUuid;

	private String description;

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

	public Evaluation() {
		this.uid = UUID.randomUUID().toString().replaceAll("-", "");
	}

	public Long getEvaluationId() {
		return evaluationId;
	}

	public void setEvaluationId(Long evaluationId) {
		this.evaluationId = evaluationId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOpenmrsSqlUuid() {
		return openmrsSqlUuid;
	}

	public void setOpenmrsSqlUuid(String openmrsSqlUuid) {
		this.openmrsSqlUuid = openmrsSqlUuid;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((evaluationId == null) ? 0 : evaluationId.hashCode());
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
		Evaluation other = (Evaluation) obj;
		if (evaluationId == null) {
			if (other.evaluationId != null)
				return false;
		} else if (!evaluationId.equals(other.evaluationId))
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
		return "Evaluation [evaluationId=" + evaluationId + ", name=" + name + ", openmrsSqlUuid=" + openmrsSqlUuid + ", description=" + description + ", uid=" + uid + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated + "]";
	}

}
