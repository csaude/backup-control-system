/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.receive;

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
import mz.org.fgh.scb.send.Send;
import mz.org.fgh.scb.send.SendService;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class ReceiveServiceImpl implements ReceiveService {

	@Autowired
	ReceiveRepository receiveRepository;
	
	@Autowired
	ResourceRepository resourceRepository;

	@Autowired
	private SendService sendService;

	@Autowired
	private Environment env;

	private String data, data_recepcao, district;

	private Send old_send = new Send();

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public Receive findOneByUuid(String uuid) {
		return receiveRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public Receive save(Receive receive) {
		if (receive.getReceiveId() == null) {
			receive.setDateCreated(new Date());
			receive.setDateUpdated(new Date());
			old_send = sendService.findOneByUuid(receive.getSend().getUid());
			old_send.setReceived(true);
			sendService.save(old_send);
			if (receive.isIkReturned() == true) {
				receive.setIkReturnedBy(receive.getCreatedBy());
			} else {
				receive.setTransporter(null);
				receive.setDateIkReturned(null);
				receive.setIkReturnedBy(null);
			}
			if (receive.isRestored() == true) {
				receive.setRestoredBy(receive.getCreatedBy());
			} else {
				receive.setDateRestored(null);
				receive.setRestoredBy(null);
			}

			new Thread(new Runnable() {
				public void run() {
					HtmlEmail email = new HtmlEmail();
					email.setHostName("smtp.gmail.com");
					email.setSmtpPort(465);
					email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
					email.setSSLOnConnect(true);
					DateFormat dateFormat1 = new SimpleDateFormat("dd/MM/yyyy");
					data = dateFormat1.format(receive.getSend().getBackupDate());
					data_recepcao = dateFormat1.format(receive.getReceiveDate());
					district = receive.getSend().getDistrict().getFullName();
					try {
						String r1 = resourceRepository.findUsersForReceiveNotification(receive.getSend().getDistrict().getDistrictId()).toString().replace("[", "");
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
						email.setSubject("[SCB-" + env.getProperty("org") + "] Recepção de backup: " + district + "-"+ data);
						email.setHtmlMsg(""
								+ "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
								+ "<thead><tr><td colspan='2' style='text-align:center;background-color:#0288D1;color:white;'>Novo registo de Recepção de Backup</td></tr><thead>"
								+ "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Distrito:</td><td>" + district + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Data do Backup:</td><td>" + data + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Data de Recepção:</td><td>" + data_recepcao + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Recebido por:</td><td>"
								+ receive.getCreatedBy().getPersonName() + "<br>("
								+ receive.getCreatedBy().getPerson().getPhoneNumber() + ")</td></tr>"
								+ "<tr><td colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>SCB</span></a><br/>" +Calendar.getInstance().get(Calendar.YEAR)+" © <a href='mailto:sis@fgh.org.mz'><span style='color:#00FFFF;'>sis@fgh.org.mz</span></a></td></tr>"
								+ "</tbody></table>");
						email.setTextMsg(
								"O seu cliente não aceita mensagens HTML. \nContacte o Administador para mais detalhes.");
						email.setCharset("utf-8");
						email.send();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			logger.info(receive.getCreatedBy().getUid() + ", created Receive: " + receive.toString());
		} else {
			Receive old_receive = this.findOneByUuid(receive.getUid());
			if (receive.isCanceled() == true) {
				receive.setDateCanceled(new Date());
				receive.setCanceledBy(receive.getUpdatedBy());
				old_send = sendService.findOneByUuid(receive.getSend().getUid());
				old_send.setReceived(false);
				sendService.save(old_send);
			} else {
				receive.setCanceledReason(null);
			}

			if (receive.isRestored() == true && old_receive.isRestored() == true) {
				receive.setRestoredBy(old_receive.getRestoredBy());
			} else if (receive.isRestored() == true && old_receive.isRestored() == false) {
				receive.setRestoredBy(receive.getUpdatedBy());
			} else if (receive.isRestored() == false) {
				receive.setDateRestored(null);
				receive.setRestoredBy(null);
			}
			if (receive.isIkReturned() == true && old_receive.isIkReturned() == true) {
				receive.setIkReturnedBy(old_receive.getIkReturnedBy());
			} else if (receive.isIkReturned() == true && old_receive.isIkReturned() == false) {
				receive.setIkReturnedBy(receive.getUpdatedBy());
			} else if (receive.isIkReturned() == false) {
				receive.setTransporter(null);
				receive.setDateIkReturned(null);
				receive.setIkReturnedBy(null);
			}
			logger.info(receive.getUpdatedBy().getUid() + ", updated Receive: " + receive.toString());
		}

		if (receive.getReceiveDate() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				receive.setReceiveDate(sdf.parse(sdf.format(receive.getReceiveDate())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		if (receive.getDateIkReturned() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				receive.setDateIkReturned(sdf.parse(sdf.format(receive.getDateIkReturned())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		if (receive.getDateRestored() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				receive.setDateRestored(sdf.parse(sdf.format(receive.getDateRestored())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		receive.setDateUpdated(new Date());
		return receiveRepository.save(receive);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Receive receive) {
		logger.info("Deleted Receive: " + receive.toString());
		receiveRepository.delete(receive);
	}

	@Transactional(readOnly = true)
	@Override
	public Receive findOneBySendUuid(String uuid) {
		return receiveRepository.findOneBySendUuid(uuid);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<Receive> findAll(Specification<Receive> spec, PageRequest pageRequest) {
		return receiveRepository.findAll(spec,pageRequest);
	}

}
