package mz.org.fgh.scb.model.entity;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
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

/**
 * @author damasceno.lopes
 *
 */
@Entity(name = "sync")
public class Sync {

	@Id
	@SequenceGenerator(name = "seq_sync", initialValue = 1)
	@GeneratedValue(generator = "seq_sync", strategy = GenerationType.AUTO)
	private Long sync_id;

	@JoinColumn(name = "server_id")
	@ManyToOne
	private Server server;
	
	@Column(nullable = false)
	private Date start_time;
	
	@Column(nullable = false)
	private int start_items_to_send;
	
	@Column(nullable = false)
	private int start_items_to_receive;
	
	@Column(nullable = true)
	private Date end_time;
	
	@Column(nullable = true)
	private int end_items_to_send;
	
	@Column(nullable = true)
	private int end_items_to_receive;

	private String observation;
	
	private String observation_his;

	@Column(nullable = false)
	private Date date_created;

	private Date date_updated;
	
	@Column(nullable = false)
	private boolean sync_error;

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

	private String canceled_reason;

	@JsonBackReference(value = "sync-canceled_by")
	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceled_by;

	public Sync() {
		this.canceled = false;
		this.uuid = UUID.randomUUID().toString();
	}

	public Long getSync_id() {
		return sync_id;
	}

	public void setSync_id(Long sync_id) {
		this.sync_id = sync_id;
	}

	public Server getServer() {
		server.setCreated_by(null);
		server.setUpdated_by(null);
		return server;
	}

	public void setServer(Server server) {
		this.server = server;
	}

	public Date getStart_time() {
		return start_time;
	}

	public void setStart_time(Date start_time) {
		this.start_time = start_time;
	}

	public int getStart_items_to_send() {
		return start_items_to_send;
	}

	public void setStart_items_to_send(int start_items_to_send) {
		this.start_items_to_send = start_items_to_send;
	}

	public int getStart_items_to_receive() {
		return start_items_to_receive;
	}

	public void setStart_items_to_receive(int start_items_to_receive) {
		this.start_items_to_receive = start_items_to_receive;
	}

	public Date getEnd_time() {
		return end_time;
	}

	public void setEnd_time(Date end_time) {
		this.end_time = end_time;
	}

	public int getEnd_items_to_send() {
		return end_items_to_send;
	}

	public void setEnd_items_to_send(int end_items_to_send) {
		this.end_items_to_send = end_items_to_send;
	}

	public int getEnd_items_to_receive() {
		return end_items_to_receive;
	}

	public void setEnd_items_to_receive(int end_items_to_receive) {
		this.end_items_to_receive = end_items_to_receive;
	}

	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
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
	
	public String getDuration() {
		if(this.end_time==null&&getEditable()==false) {
			return "NÃO\nTERMINADO";
		}else if(this.end_time==null&&getEditable()==true) {
			return "EM\nPROGRESSO";
		}else 
			if(this.end_time!=null)
		   {
			long diff = this.end_time.getTime() - this.start_time.getTime();
			long diffMinutes = diff / (60 * 1000) % 60;
			long diffHours = diff / (60 * 60 * 1000) % 24;
			long diffDays = diff / (24 * 60 * 60 * 1000);
			DecimalFormat decimalFormat= new DecimalFormat("00");
			
			if(diffDays>0) {
		    return diffDays+"d "+diffHours+"h "+diffMinutes+"min";
			}else if(diffHours>0){
		    return decimalFormat.format(diffHours)+"h "+decimalFormat.format(diffMinutes)+"min";
			}else {
			return decimalFormat.format(diffMinutes)+"min";	
			}
		
		   }else {return "";}
	}
	
	public String getServerreport() {
		return this.server.getName()+"\n"+this.server.getDistrictname();
	}
	
	@SuppressWarnings("deprecation")
	public String getSynctime() {
		if(this.end_time==null) {
			DecimalFormat decimalFormat= new DecimalFormat("00");
			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
			return sdf.format(this.start_time)+"\n"+decimalFormat.format(this.start_time.getHours())+":"+decimalFormat.format(this.start_time.getMinutes());
		}else {
		DecimalFormat decimalFormat= new DecimalFormat("00");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		return sdf.format(this.start_time)+"\n"+decimalFormat.format(this.start_time.getHours())+":"+decimalFormat.format(this.start_time.getMinutes())+"-"+decimalFormat.format(this.end_time.getHours())+":"+decimalFormat.format(this.end_time.getMinutes());
		}
		}
	
	@SuppressWarnings("deprecation")
	public String getSynctimeemailstart() {
		DecimalFormat decimalFormat= new DecimalFormat("00");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		return sdf.format(this.start_time)+" "+decimalFormat.format(this.start_time.getHours())+":"+decimalFormat.format(this.start_time.getMinutes());
		}
		
	
	@SuppressWarnings("deprecation")
	public String getSynctimeemail() {
		if(this.start_time==null||this.end_time==null) {
			return "";
		}else {
		DecimalFormat decimalFormat= new DecimalFormat("00");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		return sdf.format(this.start_time)+" "+decimalFormat.format(this.start_time.getHours())+":"+decimalFormat.format(this.start_time.getMinutes())+"-"+decimalFormat.format(this.end_time.getHours())+":"+decimalFormat.format(this.end_time.getMinutes());
		}
		}
	
	public String getStartitems() {
		return this.getStart_items_to_send()+" por enviar\n"+this.getStart_items_to_receive()+" por receber";
	}
	
	public String getEnditems() {
		return this.getEnd_items_to_send()+" por enviar\n"+this.getEnd_items_to_receive()+" por receber";
	}
	
	public String getSyncerror(){
		if(this.isSync_error()){
			return "Sim";
		}else {return "Não";}
	}
	
	public String getSyncer(){
		return this.getCreated_by().getPerson().getOthers_names()+"\n"+this.getCreated_by().getPerson().getSurname();
	}
	
	public String getObservations() {
		if(this.observation!=null&&this.observation_his==null) {
			return this.observation;
		}
		else if(this.observation==null&&this.observation_his!=null) {
			return this.observation_his;
		}
		else if(this.observation!=null&&this.observation_his!=null) {
			return "M&A: "+ this.observation+"\nSIS: "+this.observation_his;
		}
		else {return null;}
	}
	
	public String getState() {
		
		if(this.end_time==null) {
			return "Progress";
		}else {
		
		if(this.getEnd_items_to_receive()==0&&this.getEnd_items_to_send()==0) {
			return "Complete";
		}else if(this.getEnd_items_to_receive()>0||this.getEnd_items_to_send()>0) {
			return "Incomplete";
		}else {return "";}
		
		}
		
	}
	
	public boolean getEditable(){
		
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Date today = new Date();
		Date todayDate = null;
		Date syncDate = null;
		try {
			todayDate = formatter.parse(formatter.format(today));
			syncDate = formatter.parse(formatter.format(this.start_time));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		
		if(syncDate.before(todayDate)) 
			return false;
		else
			return true;
	}

	@SuppressWarnings("deprecation")
	public String getStart_time_time() {
		if(this.start_time==null) {
			return "";
		}else {
			DecimalFormat decimalFormat= new DecimalFormat("00");
			return decimalFormat.format(this.start_time.getHours())+":"+decimalFormat.format(this.start_time.getMinutes());
		}
	}
	
	@SuppressWarnings("deprecation")
	public String getEnd_time_time() {
		if(this.end_time==null) {
			return "";
		}else {
			DecimalFormat decimalFormat= new DecimalFormat("00");
			return decimalFormat.format(this.end_time.getHours())+":"+decimalFormat.format(this.end_time.getMinutes());
		}
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

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Date getDate_canceled() {
		return date_canceled;
	}

	public void setDate_canceled(Date date_canceled) {
		this.date_canceled = date_canceled;
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

	public String getObservation_his() {
		return observation_his;
	}

	public void setObservation_his(String observation_his) {
		this.observation_his = observation_his;
	}

	public User getCanceled_by() {
		if (this.canceled_by != null) {
			this.canceled_by.setDistricts(null);
			this.canceled_by.setAuthorities(null);
			return this.canceled_by;
		} else {
			return null;
		}
	}

	public void setCanceled_by(User canceled_by) {
		this.canceled_by = canceled_by;
	}

	public boolean isSync_error() {
		return sync_error;
	}

	public void setSync_error(boolean sync_error) {
		this.sync_error = sync_error;
	}

	@Override
	public String toString() {
		return "Sync [sync_id=" + sync_id + ", start_time=" + start_time + ", start_items_to_send="
				+ start_items_to_send + ", start_items_to_receive=" + start_items_to_receive + ", end_time=" + end_time
				+ ", end_items_to_send=" + end_items_to_send + ", end_items_to_receive=" + end_items_to_receive
				+ ", observation=" + observation + ", date_created=" + date_created + ", date_updated=" + date_updated
				+ ", uuid=" + uuid + ", date_canceled=" + date_canceled + ", canceled=" + canceled
				+ ", canceled_reason=" + canceled_reason + ", canceled_by=" + canceled_by + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((sync_id == null) ? 0 : sync_id.hashCode());
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
		Sync other = (Sync) obj;
		if (sync_id == null) {
			if (other.sync_id != null)
				return false;
		} else if (!sync_id.equals(other.sync_id))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}
	
	

}
