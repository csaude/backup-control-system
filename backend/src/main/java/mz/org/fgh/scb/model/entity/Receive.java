package mz.org.fgh.scb.model.entity;

import java.text.SimpleDateFormat;
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
@Entity(name = "receive")
public class Receive {

	@Id
	@SequenceGenerator(name = "seq_receive", initialValue = 1)
	@GeneratedValue(generator = "seq_receive", strategy = GenerationType.AUTO)
	private Long receive_id;

	@JoinColumn(name = "send_id")
	@ManyToOne
	private Send send;

	@Column(nullable = false)
	private Date receive_date;

	private String observation;

	@Column(nullable = false)
	private boolean ik_returned;

	private Date date_ik_returned;

	@JoinColumn(name = "transporter_id")
	@ManyToOne
	private Transporter transporter;

	@Column(nullable = false)
	private Date date_created;

	private Date date_updated;

	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	@Column(nullable = false, unique = true)
	private String uuid;

	private Date date_canceled;

	@Column(nullable = false)
	private boolean canceled;
	
	private Date date_restored;

	@Column(nullable = false)
	private boolean restored;

	private String canceled_reason;

	@JsonBackReference(value = "receive-canceled_by")
	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceled_by;
	
	@JoinColumn(name = "restored_by")
	@ManyToOne
	private User restored_by;
	
	
	@JoinColumn(name = "ik_returned_by")
	@ManyToOne
	private User ik_returned_by;

	public Receive() {
		this.canceled = false;
		this.uuid = UUID.randomUUID().toString();
	}

	public Long getReceive_id() {
		return receive_id;
	}

	public void setReceive_id(Long receive_id) {
		this.receive_id = receive_id;
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
			}else {
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

	public boolean isCanceled() {
		return canceled;
	}

	public void setCanceled(boolean canceled) {
		this.canceled = canceled;
	}

	public String getCanceled_reason() {
		return canceled_reason;
	}

	public void setCanceled_reason(String canceled_reason) {
		this.canceled_reason = canceled_reason;
	}

	public User getCanceled_by() {
		return canceled_by;
	}

	public void setCanceled_by(User canceled_by) {
		this.canceled_by = canceled_by;
	}

	public Date getDate_canceled() {
		return date_canceled;
	}

	public void setDate_canceled(Date date_canceled) {
		this.date_canceled = date_canceled;
	}

	public Send getSend() {
		return send;
	}

	public void setSend(Send send) {
		this.send = send;
	}

	public Date getReceive_date() {
		return receive_date;
	}

	public void setReceive_date(Date receive_date) {
		this.receive_date = receive_date;
	}

	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
	}

	public boolean isIk_returned() {
		return ik_returned;
	}

	public void setIk_returned(boolean ik_returned) {
		this.ik_returned = ik_returned;
	}

	public Date getDate_ik_returned() {
		return date_ik_returned;
	}

	public void setDate_ik_returned(Date date_ik_returned) {
		this.date_ik_returned = date_ik_returned;
	}

	public Transporter getTransporter() {
		return transporter;
	}

	public void setTransporter(Transporter transporter) {
		this.transporter = transporter;
	}
	
	
	public Date getDate_restored() {
		return date_restored;
	}

	public void setDate_restored(Date date_restored) {
		this.date_restored = date_restored;
	}

	public boolean isRestored() {
		return restored;
	}

	public void setRestored(boolean restored) {
		this.restored = restored;
	}
	
	public String getSender() {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		return this.getSend().getCreated_by().getPerson().getOthers_names()+"\n"+this.getSend().getCreated_by().getPerson().getSurname()+"\n"+sdf.format(this.getSend().getDate_created());
	}
	
	public String getReceiver() {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		return this.getCreated_by().getPerson().getOthers_names()+"\n"+this.getCreated_by().getPerson().getSurname()+"\n"+sdf.format(this.getDate_created());
	}
	
	public String getObsd() {
		return this.getSend().getObservation();
	}

	public User getRestored_by() {
		if (this.restored_by!= null) {
			this.restored_by.setDistricts(null);
			this.restored_by.setAuthorities(null);
			return this.restored_by;
		} else {
			return null;
		}
	}

	public void setRestored_by(User restored_by) {
		this.restored_by = restored_by;
	}

	public User getIk_returned_by() {
		if (this.ik_returned_by!= null) {
			this.ik_returned_by.setDistricts(null);
			this.ik_returned_by.setAuthorities(null);
			return this.ik_returned_by;
		} else {
			return null;
		}
	}

	public void setIk_returned_by(User ik_returned_by) {
		this.ik_returned_by = ik_returned_by;
	}

	public String getDistrictname(){
		return this.getSend().getDistrict().getName();	
	}
	
	public String getAt(){
		if(this.getSend().isUpdate_finished()){
			return "Sim";
		}else {return "Não";}
	}
	public String getSt(){
		if(this.getSend().isSync_finished()){
			return "Sim";
		}else {return "Não";}
	}
	public String getDhis2(){
		if(this.getSend().isCross_dhis2_finished()){
			return "Sim";
		}else {return "Não";}
	}
	
	public String getIdart(){
		if(this.getSend().isCross_idart_finished()){
			return "Sim";
		}else {return "Não";}
	}
	
	public String getVt(){
		if(this.getSend().isValidation_finished()){
			return "Sim";
		}else {return "Não";}
	}
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
	public Date getBackup_date_f() {
		return this.getSend().getBackup_date();
	}
	
	@Override
	public String toString() {
		return "Receive [receive_id=" + receive_id + ", receive_date=" + receive_date + ", observation=" + observation
				+ ", ik_returned=" + ik_returned + ", date_ik_returned=" + date_ik_returned + ", date_created="
				+ date_created + ", date_updated=" + date_updated + ", uuid=" + uuid + ", date_canceled="
				+ date_canceled + ", canceled=" + canceled + ", date_restored=" + date_restored + ", restored="
				+ restored + ", canceled_reason=" + canceled_reason + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((receive_id == null) ? 0 : receive_id.hashCode());
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
		Receive other = (Receive) obj;
		if (receive_id == null) {
			if (other.receive_id != null)
				return false;
		} else if (!receive_id.equals(other.receive_id))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}

}
