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

import mz.org.fgh.scb.model.entity.Receive;
import mz.org.fgh.scb.model.entity.Send;
import mz.org.fgh.scb.repository.ReceiveRepository;
import mz.org.fgh.scb.service.api.ReceiveService;
import mz.org.fgh.scb.service.api.SendService;

/**
 * @author damasceno.lopes
 *
 */
@Service
public class ReceiveServiceImpl implements ReceiveService {

	@Autowired
	ReceiveRepository receiveRepository;

	@Autowired
	private SendService sendService;

	@Autowired
	private Environment env;

	private String data, data_recepcao, district;

	private Send old_send = new Send();

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public Receive findByUuid(String uuid) {
		return receiveRepository.findByUuid(uuid);
	}

	@Override
	public Receive save(Receive receive) {
		if (receive.getReceive_id() == null) {
			receive.setDate_created(new Date());
			receive.setDate_updated(new Date());
			old_send = sendService.findByUuid(receive.getSend().getUuid());
			old_send.setReceived(true);
			sendService.save(old_send);
			if (receive.isIk_returned() == true) {
				receive.setIk_returned_by(receive.getCreated_by());
			} else {
				receive.setTransporter(null);
				receive.setDate_ik_returned(null);
				receive.setIk_returned_by(null);
			}
			if (receive.isRestored() == true) {
				receive.setRestored_by(receive.getCreated_by());
			} else {
				receive.setDate_restored(null);
				receive.setRestored_by(null);
			}

			new Thread(new Runnable() {
				public void run() {
					HtmlEmail email = new HtmlEmail();
					email.setHostName("smtp.gmail.com");
					email.setSmtpPort(465);
					email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
					email.setSSLOnConnect(true);
					DateFormat dateFormat1 = new SimpleDateFormat("dd/MM/yyyy");
					data = dateFormat1.format(receive.getSend().getBackup_date());
					data_recepcao = dateFormat1.format(receive.getReceive_date());
					district = receive.getSend().getDistrict().getName();
					try {
						String r1 = receiveRepository.findUsersForNotification(receive.getSend().getDistrict().getDistrict_id()).toString().replace("[", "");
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
						email.setSubject("[SCB-" + env.getProperty("org") + "] Recepção de backup, " + district + "-"+ data + " (No Reply)");
						email.setHtmlMsg(""
								+ "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
								+ "<thead><tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'>Novo registo de Recepção de Backup</th></tr><thead>"
								+ "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Distrito:</td><td>" + district + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Data do Backup:</td><td>" + data + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Data de Recepção:</td><td>" + data_recepcao + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Recebido por:</td><td>"
								+ receive.getCreated_by().getPerson().getOthers_names() + " "
								+ receive.getCreated_by().getPerson().getSurname() + "<br>("
								+ receive.getCreated_by().getPerson().getPhone_number() + ")</td></tr>"
								+ "<tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>Sistema de Controle de Backup</span></a><br/>Mantido por: <a href='mailto:his@fgh.org.mz'><span style='color:#00FFFF;'>his@fgh.org.mz</span></a></th></tr>"
								+ "</tbody></table>");
						email.setTextMsg(
								"O seu cliente não aceita mensagens HTML. \nContacte o Administador para mais detalhes.");
						email.send();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			logger.info(receive.getCreated_by().getUsername() + ", created Receive: " + receive.toString());
		} else {
			Receive old_receive = this.findByUuid(receive.getUuid());
			if (receive.isCanceled() == true) {
				receive.setDate_canceled(new Date());
				receive.setCanceled_by(receive.getUpdated_by());
				old_send = sendService.findByUuid(receive.getSend().getUuid());
				old_send.setReceived(false);
				sendService.save(old_send);
			} else {
				receive.setCanceled_reason(null);
			}

			if (receive.isRestored() == true && old_receive.isRestored() == true) {
				receive.setRestored_by(old_receive.getRestored_by());
			} else if (receive.isRestored() == true && old_receive.isRestored() == false) {
				receive.setRestored_by(receive.getUpdated_by());
			} else if (receive.isRestored() == false) {
				receive.setDate_restored(null);
				receive.setRestored_by(null);
			}
			if (receive.isIk_returned() == true && old_receive.isIk_returned() == true) {
				receive.setIk_returned_by(old_receive.getIk_returned_by());
			} else if (receive.isIk_returned() == true && old_receive.isIk_returned() == false) {
				receive.setIk_returned_by(receive.getUpdated_by());
			} else if (receive.isIk_returned() == false) {
				receive.setTransporter(null);
				receive.setDate_ik_returned(null);
				receive.setIk_returned_by(null);
			}
			logger.info(receive.getUpdated_by().getUsername() + ", updated Receive: " + receive.toString());
		}

		if (receive.getReceive_date() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				receive.setReceive_date(sdf.parse(sdf.format(receive.getReceive_date())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		if (receive.getDate_ik_returned() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				receive.setDate_ik_returned(sdf.parse(sdf.format(receive.getDate_ik_returned())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		if (receive.getDate_restored() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				receive.setDate_restored(sdf.parse(sdf.format(receive.getDate_restored())));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		return receiveRepository.save(receive);
	}

	@Override
	public void delete(Receive receive) {
		logger.info("Deleted Receive: " + receive.toString());
		receiveRepository.delete(receive);
	}

	@Override
	public Receive findBySendId(Long send_id) {
		return receiveRepository.findBySendId(send_id);
	}

	@Override
	public Page<Receive> findByDistrictId(Long district_id, Pageable pageable) {
		return receiveRepository.findByDistrictId(district_id, pageable);
	}

	@Override
	public Page<Receive> findByDistrictId(Long district_id, Pageable pageable, Date from, Date until) {
		return receiveRepository.findByDistrictId(district_id, pageable, from, until);
	}

	@Override
	public Page<Receive> findByUserId(Pageable pageable, String username) {
		return receiveRepository.findByUserId(pageable, username);
	}

	@Override
	public Page<Receive> findByUserId(Pageable pageable, Date from, Date until, String username) {
		return receiveRepository.findByUserId(pageable, from, until, username);
	}

	@Override
	public Page<Receive> findAllReceived(Pageable pageable) {
		return receiveRepository.findAllReceived(pageable);
	}

	@Override
	public Page<Receive> findByDate(Pageable pageable, Date from, Date until) {
		return receiveRepository.findByDate(pageable, from, until);
	}

}
