package mz.org.fgh.scb.service.impl;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.HtmlEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Sync;
import mz.org.fgh.scb.repository.SyncRepository;
import mz.org.fgh.scb.service.api.SyncService;

/**
 * @author damasceno.lopes
 *
 */
@Service
public class SyncServiceImpl implements SyncService {

	@Autowired
	SyncRepository syncRepository;

	@Autowired
	private Environment env;

	private String  start_time, start_items_to_send, start_items_to_receive, end_time, end_items_to_send, end_items_to_receive, district, province, obs;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public Sync findByUuid(String uuid) {
		return syncRepository.findByUuid(uuid);
	}

	@Override
	public Sync save(Sync sync) {
		if (sync.getSync_id() == null) {
			sync.setDate_created(new Date());
			sync.setDate_updated(new Date());
/*
			DateFormat dateFormat1 = new SimpleDateFormat("dd/MM/yyyy HH:mm");
			start_time = dateFormat1.format(sync.getBackup_date());
			obs = sync.getObservation();
			transporter_name = sync.getTransporter().getName() + "";
			transporter_phone = sync.getTransporter().getPhone_number() + "";
			transporter_role = sync.getTransporter().getRole() + "";
			district = sync.getDistrict().getName();
			province = sync.getDistrict().getProvince();

			new Thread(new Runnable() {
				public void run() {
					HtmlEmail email = new HtmlEmail();
					email.setHostName("smtp.gmail.com");
					email.setSmtpPort(465);
					email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
					email.setSSLOnConnect(true);
					try {
						String r1 = syncRepository.findUsersForNotification(sync.getDistrict().getDistrict_id()).toString().replace("[", "");
						String r2 = r1.replace("]", " ");
						String[] temp;
						String divisor = ", ";
						temp = r2.split(divisor);
						int i = 0;

						while (i < temp.length) {
							email.addBcc(temp[i] + "");
							i++;
						}
						email.setFrom("scb.fgh@gmail.com", "SCB");
						email.setSubject("[SCB-" + env.getProperty("org") + "] Envio de backup, " + district + "-"+ data + " (No Reply)");
						email.setHtmlMsg(""
								+ "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
								+ "<thead><tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'>Novo registo de Envio de Backup</th></tr><thead>"
								+ "<tbody><tr>" + "<td colspan='2' bgcolor='#F3F3F3' style='font-size:14px;'>"
								+ province + " / " + district + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Data do Backup:</td><td>" + data + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Actualização Terminada?</td><td>" + at + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Sincronização Terminada?</td><td>" + st + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Cruzamento com DHIS2?</td><td>" + c_dhis + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Cruzamento com iDART?</td><td>" + c_idart + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Validação Terminada?</td><td>" + vt + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3' aling='top'>Observação Distrital:</td><td>" + obs
								+ "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Enviado por:</td><td>"
								+ sync.getCreated_by().getPerson().getOthers_names() + " "
								+ sync.getCreated_by().getPerson().getSurname() + "<br>("
								+ sync.getCreated_by().getPerson().getPhone_number() + ")" + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Transportado por:</td><td>" + transporter_role + ": "
								+ transporter_name + "<br>(" + transporter_phone + ")" + "</td></tr>"
								+ "<tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>Sistema de Controle de Backup</span></a><br/>Mantido por: <a href='mailto:his@fgh.org.mz'><span style='color:#00FFFF;'>his@fgh.org.mz</span></a></th></tr>"
								+ "</tbody></table>");
						email.setTextMsg(
								"O seu cliente não aceita mensagens HTML. \nContacte o Administador para mais detalhes.");
						email.sync();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			*/
			logger.info(sync.getCreated_by().getUsername() + ", created Sync: " + sync.toString());
		} else {
			sync.setDate_updated(new Date());
			Sync sync_bd = syncRepository.findOne(sync.getSync_id());
			sync.setDate_created(sync_bd.getDate_created());
			sync.setUuid(sync_bd.getUuid());
			if (sync.isCanceled() == true) {
				sync.setDate_canceled(new Date());
				sync.setCanceled_by(sync.getUpdated_by());
			} else {
				sync.setCanceled_reason(null);
			}
			if (sync.getUpdated_by() != null) {
				logger.info(sync.getUpdated_by().getUsername() + ", updated Sync: " + sync.toString());
			}

			
		}
		if (sync.getStart_time() != null) {
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
			try {
				sync.setStart_time(sdf.parse(sdf.format(sync.getStart_time())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		
		if (sync.getEnd_time() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
			try {
				sync.setEnd_time(sdf.parse(sdf.format(sync.getEnd_time())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return syncRepository.save(sync);
	}

	@Override
	public void delete(Sync sync) {
		logger.info("Deleted Sync: " + sync.toString());
		syncRepository.delete(sync);
	}

	public Sync findById(Long id) {
		return syncRepository.findOne(id);
	}

	@Override
	public Page<Sync> findByDistrictId(Long district_id, Pageable pageable) {
		return syncRepository.findByDistrictId(district_id, pageable);
	}

	@Override
	public Page<Sync> findByDistrictId(Long district_id, Pageable pageable, Date from, Date until) {
		return syncRepository.findByDistrictId(district_id, pageable, from, until);
	}

	@Override
	public Page<Sync> findByUserId(Pageable pageable, String username) {
		return syncRepository.findByUserId(pageable, username);
	}

	@Override
	public Page<Sync> findByUserId(Pageable pageable, Date from, Date until, String username) {
		return syncRepository.findByUserId(pageable, from, until, username);
	}

	@Override
	public Page<Sync> findAll(Pageable pageable) {
		return syncRepository.findAll(pageable);
	}

	@Override
	public Page<Sync> findByServerId(Long server_id, Pageable pageable) {
		return syncRepository.findByServerId(server_id,pageable);
	}

	@Override
	public Page<Sync> findByServerId(Long server_id, Pageable pageable, Date from, Date until) {
		return syncRepository.findByServerId(server_id, pageable, from, until);
	}

	@Override
	public Page<Sync> findAllByDate(Pageable pageable, Date from, Date until) {
		return syncRepository.findAllByDate(pageable, from, until);
	}

}
