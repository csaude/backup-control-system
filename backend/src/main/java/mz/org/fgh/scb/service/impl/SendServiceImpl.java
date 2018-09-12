/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Send;
import mz.org.fgh.scb.repository.ResourceRepository;
import mz.org.fgh.scb.repository.SendRepository;
import mz.org.fgh.scb.service.api.SendService;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
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

	private String at, vt, st, c_dhis, c_idart, data, obs, transporter_name, transporter_phone, district, transporter_role, idart_backup;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public Send findOneByUuid(String uuid) {
		return sendRepository.findOneByUuid(uuid);
	}

	@Override
	public Send save(Send send) {
		if (send.getSend_id() == null) {
			send.setDate_created(new Date());
			send.setDate_updated(new Date());
			// ------------------------------
			// E-mail notification properties
			// ------------------------------
			DateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
			if (send.isUpdate_finished() == true) {
				at = "Sim";
			} else {
				at = "Não";
			}
			if (send.isValidation_finished() == true) {
				vt = "Sim";
			} else {
				vt = "Não";
			}
			if (send.isSync_finished() == true) {
				st = "Sim";
			} else {
				st = "Não";
			}
			if (send.isCross_dhis2_finished() == true) {
				c_dhis = "Sim";
			} else {
				c_dhis = "Não";
			}
			if (send.isCross_idart_finished() == true) {
				c_idart = "Sim";
			} else {
				c_idart = "Não";
			}
			if (send.isIdart_backup() == true) {
				idart_backup = "Sim - " + simpleDateFormat.format(send.getIdart_backup_date());
				;
			} else {
				idart_backup = "Não";
			}

			data = simpleDateFormat.format(send.getBackup_date());
			obs = send.getObservation();
			transporter_name = send.getTransporter().getName() + "";
			transporter_phone = send.getTransporter().getPhone_number() + "";
			transporter_role = send.getTransporter().getRole() + "";
			district = send.getDistrict().getNamef();
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
						String r1 = resourceRepository.findUsersForSendNotification(send.getDistrict().getDistrict_id()).toString().replace("[", "");
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
						email.setSubject("[SCB-" + env.getProperty("org") + "] Envio de backup, " + district + "-" + data + " (No Reply)");
						email.setHtmlMsg("" + "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
								+ "<thead><tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'>Novo registo de Envio de Backup</th></tr><thead>" + "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Distrito:</td><td>"
								+ district + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Data do Backup:</td><td>" + data + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Actualização Terminada?</td><td>" + at + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Sincronização Terminada?</td><td>" + st + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Cruzamento com DHIS2?</td><td>" + c_dhis + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Cruzamento com iDART?</td><td>" + c_idart + "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Validação Terminada?</td><td>" + vt + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Incluiu backup de\niDART?</td><td>" + idart_backup + "</td></tr>" + "<tr><td bgcolor='#F3F3F3' aling='top'>Observação Distrital:</td><td>" + obs + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Enviado por:</td><td>" + send.getCreated_by().getPerson().getOthers_names() + " " + send.getCreated_by().getPerson().getSurname() + "<br>("
								+ send.getCreated_by().getPerson().getPhone_number() + ")</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Transportado por:</td><td>" + transporter_role + ":<br>" + transporter_name + "<br>(" + transporter_phone
								+ ")" + "</td></tr>"
								+ "<tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>Sistema de Controle de Backup</span></a><br/>Mantido por: <a href='mailto:his@fgh.org.mz'><span style='color:#00FFFF;'>his@fgh.org.mz</span></a></th></tr>"
								+ "</tbody></table>");
						email.setTextMsg("O seu cliente não aceita mensagens HTML. \nContacte o Administador para mais detalhes.");
						email.setCharset("utf-8");
						email.send();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			logger.info(send.getCreated_by().getUsername() + ", created Send: " + send.toString());
		} else {
			//Its not necessary send Notification on update
			send.setDate_updated(new Date());
			Send send_bd = sendRepository.findOne(send.getSend_id());
			send.setDate_created(send_bd.getDate_created());
			send.setUuid(send_bd.getUuid());
			if (send.isCanceled() == true) {
				send.setDate_canceled(new Date());
				send.setCanceled_by(send.getUpdated_by());
			} else {
				send.setCanceled_reason(null);
			}
			if (send.getUpdated_by() != null) {
				logger.info(send.getUpdated_by().getUsername() + ", updated Send: " + send.toString());
			}

			if (send.isIk_received() == false) {
				send.setDate_ik_received(null);
			}
		}
		if (send.getBackup_date() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				send.setBackup_date(sdf.parse(sdf.format(send.getBackup_date())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return sendRepository.save(send);
	}

	@Override
	public void delete(Send send) {
		logger.info("Deleted Send: " + send.toString());
		sendRepository.delete(send);
	}

	@Override
	public Page<Send> findAll(Specification<Send> spec, PageRequest pageRequest) {
		return sendRepository.findAll(spec, pageRequest);
	}

}
