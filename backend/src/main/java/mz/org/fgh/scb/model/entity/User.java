package mz.org.fgh.scb.model.entity;

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

/**
 * @author damasceno.lopes
 *
 */
@Entity(name = "user")
public class User {

	@Id
	@SequenceGenerator(name = "seq_user", initialValue = 1)
	@GeneratedValue(generator = "seq_user", strategy = GenerationType.AUTO)
	private Long user_id;

	@JoinColumn(name = "person_id")
	@OneToOne
	private Person person;

	@Column(unique = true, nullable = false)
	private String username;

	@JsonBackReference(value="user-password")
	@Column(nullable = false)
	private String password;
	

	@Column(nullable = false)
	private Date date_created;

	private Date date_updated;

	@JsonBackReference(value="user-created_by")
	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	@JsonBackReference(value="user-updated_by")
	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_district", joinColumns = {
			@JoinColumn(name = "user_id", referencedColumnName = "user_id") }, inverseJoinColumns = {
					@JoinColumn(name = "district_id", referencedColumnName = "district_id") }, uniqueConstraints = {
							@UniqueConstraint(columnNames = { "user_id", "district_id" }) })
	private Set<District> districts = new HashSet<District>(0);

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_authority", joinColumns = {
			@JoinColumn(name = "user_id", referencedColumnName = "user_id") }, inverseJoinColumns = {
					@JoinColumn(name = "authority_id", referencedColumnName = "authority_id") }, uniqueConstraints = {
							@UniqueConstraint(columnNames = { "user_id", "authority_id" }) })
	private Set<Authority> authorities = new HashSet<Authority>(0);;

	private boolean enabled;

	private String locale;

	@Column(nullable = false, unique = true)
	private String uuid;

	@Column(nullable = false)
	private boolean notification;
	
	private Date last_login;

	public User() {
		this.enabled = true;
		this.notification = true;
		this.uuid = UUID.randomUUID().toString();
		}

	public User(Person person) {
		this.person = person;
	}

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
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

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}


	public User getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(User updated_by) {
		this.updated_by = updated_by;
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

	public Set<District> getDistricts() {
		if (this.districts != null) {
			Set <District> districts = new HashSet<District>(0);
			for (District d : this.districts) {
				Set <Ironkey> ironkeys = new HashSet<Ironkey>(0);
				for(Ironkey i : d.getIronkeys()) {
					i.setDistricts(null);
					i.setCreated_by(null);
					i.setUpdated_by(null);
					ironkeys.add(i);
				}
				
				d.setIronkeys(ironkeys);
				d.setCreated_by(null);
				d.setUpdated_by(null);
				d.setUsers(null);
				districts.add(d);
			}
			return districts;

		} else {
			return null;
		}
	}

	public void setDistricts(Set<District> districts) {
		this.districts = districts;
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

	public boolean isNotification() {
		return notification;
	}

	public void setNotification(boolean notification) {
		this.notification = notification;
	}

	public Set<Authority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Set<Authority> authorities) {
		this.authorities = authorities;
	}
	
	public Date getLast_login() {
		return last_login;
	}

	public void setLast_login(Date last_login) {
		this.last_login = last_login;
	}
	
	public String getCreatorname(){
		return this.getCreated_by().getPerson().getOthers_names()+" "+this.getCreated_by().getPerson().getSurname();
	}
	
	public String getUpdatername(){
		if(this.getUpdated_by()==null)
			return null;
		else	
		return this.getUpdated_by().getPerson().getOthers_names()+" "+this.getUpdated_by().getPerson().getSurname();
	}
	
	public Long getCreatorid(){
		return this.getCreated_by().getUser_id();
	}
	
	public Long getUpdaterid(){
		if(this.getUpdated_by()==null)
			return null;
		else	
		return this.getUpdated_by().getUser_id();
	}

	@Override
	public String toString() {
		return "User [user_id=" + user_id + ", username=" + username + ", date_created="
				+ date_created + ", date_updated=" + date_updated + ", enabled=" + enabled + ", locale=" + locale
				+ ", uuid=" + uuid + ", notification=" + notification + ", last_login=" + last_login + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((user_id == null) ? 0 : user_id.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
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
		if (user_id == null) {
			if (other.user_id != null)
				return false;
		} else if (!user_id.equals(other.user_id))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}
}
