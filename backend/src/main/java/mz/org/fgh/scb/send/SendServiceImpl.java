/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.send;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.HtmlEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mz.org.fgh.scb.resource.ResourceRepository;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class SendServiceImpl implements SendService {

	@Autowired
	SendRepository sendRepository;

	@Autowired
	ResourceRepository resourceRepository;

	@Autowired
	private Environment env;

	private String at, vt, st, c_dhis, c_idart, data, obs, transporter_name,transporter_role, transporter_phone, district, idart_backup;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public Send findOneByUuid(String uuid) {
		return sendRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public Send save(Send send) {
		if (send.getSendId() == null) {
			send.setDateCreated(new Date());
			send.setDateUpdated(new Date());
			// ------------------------------
			// E-mail notification properties
			// ------------------------------
			DateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
			if (send.isUpdateFinished() == true) {
				at = "Sim";
			} else {
				at = "Não";
			}
			if (send.isValidationFinished() == true) {
				vt = "Sim";
			} else {
				vt = "Não";
			}
			if (send.isSyncFinished() == true) {
				st = "Sim";
			} else {
				st = "Não";
			}
			if (send.isCrossDhis2Finished() == true) {
				c_dhis = "Sim";
			} else {
				c_dhis = "Não";
			}
			if (send.isCrossIdartFinished() == true) {
				c_idart = "Sim";
			} else {
				c_idart = "Não";
			}
			if (send.isIdartBackup() == true) {
				idart_backup = "Sim - " + simpleDateFormat.format(send.getIdartBackupDate());
				;
			} else {
				idart_backup = "Não";
			}

			data = simpleDateFormat.format(send.getBackupDate());
			obs = send.getObservation();
			transporter_name = send.getTransporter().getName() + "";
			transporter_phone = send.getTransporter().getPhoneNumber() + "";
			transporter_role=send.getTransporter().getRole()+ "";
			district = send.getDistrict().getFullName();
			// ---------------------------------
			// create new thread for send E-mail
			// ---------------------------------
			new Thread(new Runnable() {
				public void run() {
					HtmlEmail email = new HtmlEmail();
					email.setHostName("smtp.gmail.com");
					email.setSmtpPort(465);
					email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
					email.setSSLOnConnect(true);
					try {
						String r1 = resourceRepository.findUsersForSendNotification(send.getDistrict().getDistrictId()).toString().replace("[", "");
						String r2 = r1.replace("]", " ");
						String[] temp;
						String divisor = ", ";
						temp = r2.split(divisor);
						int i = 0;

						while (i < temp.length) {
							email.addBcc(temp[i] + "");
							i++;
						}
						email.setFrom("scb.fgh@gmail.com", "SCB-"+ env.getProperty("org")+" Message [No Reply]");
						email.setSubject("[SCB-" + env.getProperty("org") + "] Envio de backup: " + district + "-" + data);
						email.setHtmlMsg("" + "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
								+ "<thead><tr><td colspan='2' style='text-align:center;background-color:#0288D1;color:white;'>Novo registo de Envio de Backup</td></tr><thead>" + "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Distrito:</td><td>"
								+ district + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Data do Backup:</td><td>" + data + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Actualização Terminada?</td><td>" + at + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Sincronização Terminada?</td><td>" + st + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Cruzamento com DHIS2?</td><td>" + c_dhis + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Cruzamento com iDART?</td><td>" + c_idart + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Validação Terminada?</td><td>" + vt + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Inclui backup de\niDART?</td><td>" + idart_backup + "</td></tr>" + "<tr><td bgcolor='#F3F3F3' aling='top'>Observação Distrital:</td><td>" + obs + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Enviado por:</td><td>" + send.getCreatedBy().getPersonName()+ "<br>("
								+ send.getCreatedBy().getPerson().getPhoneNumber() + ")</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Transportado por:</td><td>"+ transporter_role + ":<br>"+ transporter_name + "<br>(" + transporter_phone
								+ ")" + "</td></tr>"
								+ "<tr><td colspan='2' style='text-align:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>SCB</span></a><br/>" +Calendar.getInstance().get(Calendar.YEAR)+" © <a href='mailto:sis@fgh.org.mz'><span style='color:#00FFFF;'>sis@fgh.org.mz</span></a></td></tr>"
								+ "</tbody></table>");
						email.setTextMsg("O seu cliente não aceita mensagens HTML. \nContacte o Administador para mais detalhes.");
						email.setCharset("utf-8");
						email.send();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			logger.info(send.getCreatedBy().getUid() + ", created Send: " + send.toString());
		} else {
			//Its not necessary send Notification on update
			send.setDateUpdated(new Date());
			if (send.isCanceled() == true) {
				send.setDateCanceled(new Date());
				send.setCanceledBy(send.getUpdatedBy());
			} else {
				send.setCanceledReason(null);
			}
			if (send.getUpdatedBy() != null) {
				logger.info(send.getUpdatedBy().getUid() + ", updated Send: " + send.toString());
			}

			if (send.isIkReceived() == false) {
				send.setDateIkReceived(null);
			}
		}
		if (send.getBackupDate() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				send.setBackupDate(sdf.parse(sdf.format(send.getBackupDate())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return sendRepository.save(send);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Send send) {
		logger.info("Deleted Send: " + send.toString());
		sendRepository.delete(send);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<Send> findAll(Specification<Send> spec, PageRequest pageRequest) {
		return sendRepository.findAll(spec, pageRequest);
	}

}
