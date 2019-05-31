package mz.org.fgh.scb.authority;

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

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModelProperty;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Entity(name = "authority")
public class Authority {

	@Id
	@SequenceGenerator(name = "seq_authority", initialValue = 1)
	@GeneratedValue(generator = "seq_authority", strategy = GenerationType.AUTO)
	@Column(name = "authority_id")
	private Long authorityId;

	@Column(nullable = false, unique = true)
	private String name;

	private String description;

	@ApiModelProperty(hidden = true)
	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "authorities")
	private Set<User> users = new HashSet<User>(0);

	public Authority() {

	}

	public Long getAuthorityId() {
		return authorityId;
	}

	public void setAuthorityId(Long authorityId) {
		this.authorityId = authorityId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((authorityId == null) ? 0 : authorityId.hashCode());
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
		if (authorityId == null) {
			if (other.authorityId != null)
				return false;
		} else if (!authorityId.equals(other.authorityId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Authority [authorityId=" + authorityId + ", name=" + name + ", description=" + description + "]";
	}

	

}
