/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.service.impl;

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
 * @author Damasceno Lopes
 *
 */
@Service
public class SyncServiceImpl implements SyncService {

	@Autowired
	SyncRepository syncRepository;

	@Autowired
	private Environment env;

	private String  sync_time,duration, start_items_to_send, start_items_to_receive, end_items_to_send, end_items_to_receive, district, obs,error,server;

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

			if(sync.getState().equals("Progress")) {
				sync_time=sync.getSynctimeemailstart();
				duration="<span style='color:white;background-color: orange; font-size: 11px;border-radius: 5%; padding: 5px;'>EM PROGRESSO</span>";
				end_items_to_send = "";
				end_items_to_receive = "";
			}else {
				sync_time = sync.getSynctimeemail();
				duration=sync.getDuration();
				end_items_to_send = sync.getEnd_items_to_send()+" por enviar";
				end_items_to_receive = sync.getEnd_items_to_receive()+" por receber";
			}
			
			start_items_to_send = sync.getStart_items_to_send()+"";
			start_items_to_receive = sync.getStart_items_to_receive()+"";
			
			if (sync.isSync_error() == true) {
				error = "Sim";
			} else {
				error = "Não";
			}
			
			obs = sync.getObservations();
			
			
			district = sync.getServer().getDistrict().getNamef();
			server=sync.getServer().getName()+" ("+sync.getServer().getType()+")";

			new Thread(new Runnable() {
				public void run() {
					HtmlEmail email = new HtmlEmail();
					email.setHostName("smtp.gmail.com");
					email.setSmtpPort(465);
					email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
					email.setSSLOnConnect(true);
					try {
						String r1 = syncRepository.findUsersForNotification(sync.getServer().getDistrict().getDistrict_id()).toString().replace("[", "");
						String r2 = r1.replace("]", " ");
						String[] temp;
						String divisor = ", ";
						temp = r2.split(divisor);
						int i = 0;
						
						String final_state="";
						if(sync.getState().equals("Progress")) {
							
							final_state="";
							
						}else {
							if(end_items_to_send.equals("0 por enviar")&&end_items_to_receive.equals("0 por receber")) {
								final_state="<span style='color:white;background-color: green; font-size: 11px;border-radius: 5%; padding: 5px;'>SYNCHRONIZED</span>";
							}else {
								final_state="<span style='color:white;background-color: red; font-size: 11px;border-radius: 5%; padding: 5px;'>NOT SYNCHRONIZED</span>";
							}
							
						}

						while (i < temp.length) {
							email.addBcc(temp[i] + "");
							i++;
						}
						email.setFrom("scb.fgh@gmail.com", "SCB");
						email.setSubject("[SCB-" + env.getProperty("org") + "] Registo de Sincronização, " + server + "-"+ sync_time + " (No Reply)");
						email.setHtmlMsg(""
								+ "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
								+ "<thead><tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'>Registo de Sincronização</th></tr><thead>"
								+ "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Servidor:</td><td>" + server + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Distrito:</td><td>" + district + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Horário de<br>Sincronização:</td><td>" + sync_time + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Duração:</td><td>" + duration + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Nº de itens por enviar<br>na hora inicial</td><td>" + start_items_to_send+" por enviar<br>"+start_items_to_receive + " por receber</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Nº de itens por enviar<br>na hora final</td><td>" + end_items_to_send+"<br>"+end_items_to_receive + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Encontrou erro<br>ao sincronizar?</td><td>" + error + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Estado final:</td><td>" + final_state + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3' aling='top'>Observação:</td><td>" + obs
								+ "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Sincronização<br>iniciada por:</td><td>"
								+ sync.getCreated_by().getPerson().getOthers_names() + " "
								+ sync.getCreated_by().getPerson().getSurname() + "<br>("
								+ sync.getCreated_by().getPerson().getPhone_number() + ")" + "</td></tr>"
								+ "<tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>Sistema de Controle de Backup</span></a><br/>Mantido por: <a href='mailto:his@fgh.org.mz'><span style='color:#00FFFF;'>his@fgh.org.mz</span></a></th></tr>"
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
				
				
				if(sync.getState().equals("Progress")) {
					sync_time=sync.getSynctimeemailstart();
					duration="<span style='color:white;background-color: orange; font-size: 11px;border-radius: 5%; padding: 5px;'>EM PROGRESSO</span>";
					end_items_to_send = "";
					end_items_to_receive = "";
				}else {
					sync_time = sync.getSynctimeemail();
					duration=sync.getDuration();
					end_items_to_send = sync.getEnd_items_to_send()+" por enviar";
					end_items_to_receive = sync.getEnd_items_to_receive()+" por receber";
				}
				
				start_items_to_send = sync.getStart_items_to_send()+"";
				start_items_to_receive = sync.getStart_items_to_receive()+"";
				
				if (sync.isSync_error() == true) {
					error = "Sim";
				} else {
					error = "Não";
				}
				
				obs = sync.getObservations();
				
				
				district = sync.getServer().getDistrict().getNamef();
				server=sync.getServer().getName()+" ("+sync.getServer().getType()+")";

				new Thread(new Runnable() {
					public void run() {
						HtmlEmail email = new HtmlEmail();
						email.setHostName("smtp.gmail.com");
						email.setSmtpPort(465);
						email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
						email.setSSLOnConnect(true);
						try {
							String r1 = syncRepository.findUsersForNotification(sync.getServer().getDistrict().getDistrict_id()).toString().replace("[", "");
							String r2 = r1.replace("]", " ");
							String[] temp;
							String divisor = ", ";
							temp = r2.split(divisor);
							int i = 0;
							
							String final_state="";
							
							if(sync.getState().equals("Progress")) {
								
								final_state="";
								
							}else {
								if(end_items_to_send.equals("0 por enviar")&&end_items_to_receive.equals("0 por receber")) {
									final_state="<span style='color:white;background-color: green; font-size: 11px;border-radius: 5%; padding: 5px;'>SYNCHRONIZED</span>";
								}else {
									final_state="<span style='color:white;background-color: red; font-size: 11px;border-radius: 5%; padding: 5px;'>NOT SYNCHRONIZED</span>";
								}
								
							}
							
							

							while (i < temp.length) {
								email.addBcc(temp[i] + "");
								i++;
							}
							email.setFrom("scb.fgh@gmail.com", "SCB");
							email.setSubject("[SCB-" + env.getProperty("org") + "] Registo de Sincronização, " + server + "-"+ sync_time + " (No Reply)");
							email.setHtmlMsg(""
									+ "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
									+ "<thead><tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'>Registo de Sincronização</th></tr><thead>"
									+ "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Servidor:</td><td>" + server + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Distrito:</td><td>" + district + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Horário de<br>Sincronização:</td><td>" + sync_time + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Duração:</td><td>" + duration + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Nº de itens por enviar<br>na hora inicial</td><td>" + start_items_to_send+" por enviar<br>"+start_items_to_receive + " por receber</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Nº de itens por enviar<br>na hora final</td><td>" + end_items_to_send+"<br>"+end_items_to_receive + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Encontrou erro<br>ao sincronizar?</td><td>" + error + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Estado final:</td><td>" + final_state + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3' aling='top'>Observação:</td><td>" + obs
									+ "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Sincronização<br>iniciada por:</td><td>"
									+ sync.getCreated_by().getPerson().getOthers_names() + " "
									+ sync.getCreated_by().getPerson().getSurname() + "<br>("
									+ sync.getCreated_by().getPerson().getPhone_number() + ")" + "</td></tr>"
									+ "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Sincronização<br>actualizada por:</td><td>"
									+ sync.getUpdated_by().getPerson().getOthers_names() + " "
									+ sync.getUpdated_by().getPerson().getSurname() + "<br>("
									+ sync.getUpdated_by().getPerson().getPhone_number() + ")" + "</td></tr>"
									+ "<tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>Sistema de Controle de Backup</span></a><br/>Mantido por: <a href='mailto:his@fgh.org.mz'><span style='color:#00FFFF;'>his@fgh.org.mz</span></a></th></tr>"
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
				
				logger.info(sync.getCreated_by().getUsername() + ", created Sync: " + sync.toString());
			
				
			}
			if (sync.getUpdated_by() != null) {
				logger.info(sync.getUpdated_by().getUsername() + ", updated Sync: " + sync.toString());
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
	public Page<Sync> findByDistrictIdAndDateRange(Long district_id, Pageable pageable, Date from, Date until) {
		return syncRepository.findByDistrictIdAndDateRange(district_id, pageable, from, until);
	}

	@Override
	public Page<Sync> findByUsername(Pageable pageable, String username) {
		return syncRepository.findByUsername(pageable, username);
	}

	@Override
	public Page<Sync> findByUserIdAndDateRange(Pageable pageable, Date from, Date until, String username) {
		return syncRepository.findByUsernameAndDateRange(pageable, from, until, username);
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
	public Page<Sync> findByServerIdAndDateRange(Long server_id, Pageable pageable, Date from, Date until) {
		return syncRepository.findByServerIdAndDateRange(server_id, pageable, from, until);
	}

	@Override
	public Page<Sync> findAllByDateRange(Pageable pageable, Date from, Date until) {
		return syncRepository.findAllByDateRange(pageable, from, until);
	}
	
	public int findInProgress() {
		return syncRepository.findInProgress();
	}
	
	public int findInProgressByUser(String username) {
		return syncRepository.findInProgressByUser(username);
	}

}
