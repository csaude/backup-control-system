package mz.org.fgh.scb.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.model.entity.Sync;
import mz.org.fgh.scb.service.impl.SyncServiceImpl;

/**
 * @author damasceno.lopes
 *
 */
@RestController
@RequestMapping("api")
public class SyncController {

	@Autowired
	private SyncServiceImpl syncServiceImpl;

	@RequestMapping(value = "/syncs", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public String create(@RequestBody Sync sync) {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@RequestMapping(value = "/syncs/{uuid}", method = RequestMethod.GET)
	public Object getSync(@PathVariable String uuid) throws Exception {
		return syncServiceImpl.findByUuid(uuid);
	}
	
	@RequestMapping(value = "/syncsinprogress", method = RequestMethod.GET)
	public int findInProgress() throws Exception {
		return syncServiceImpl.findInProgress();
	}
	
	@RequestMapping(value = "/syncsinprogressuser", method = RequestMethod.GET)
	public int findInProgressByUser() throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		return syncServiceImpl.findInProgressByUser(currentPrincipalName);
	}
	
	@RequestMapping(value = "/syncss/{id}", method = RequestMethod.GET)
	public Object getSyncById(@PathVariable Long id) throws Exception {
		return syncServiceImpl.findById(id);
	}
	
	@RequestMapping(value = "/syncsdistrict/get", method = RequestMethod.GET)
	public Page<Sync> findByDistrictId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "district", required = true) Long district_id) throws Exception {
		Page<Sync> pageSync = syncServiceImpl.findByDistrictId(district_id,
				new PageRequest(page - 1, 10));
		if (page - 1 > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;	
	}
	
	@RequestMapping(value = "/syncsserver/get", method = RequestMethod.GET)
	public Page<Sync> findByServerId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "server", required = true) Long server_id) throws Exception {
		Page<Sync> pageSync = syncServiceImpl.findByServerId(server_id,
				new PageRequest(page - 1, 10));
		if (page - 1 > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;	
	}
	
	@RequestMapping(value = "/syncsall/get", method = RequestMethod.GET)
	public Page<Sync> findAllNotReceived(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size) throws Exception {
		Page<Sync> pageSend = syncServiceImpl.findAll(new PageRequest(page - 1, 10));
		if (page - 1 > pageSend.getTotalPages()) {
			throw new Exception();
		}
		return pageSend;	
	}
	
	@RequestMapping(value = "/syncsuser/get", method = RequestMethod.GET)
	public Page<Sync> findByUserId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		Page<Sync> pageSync = syncServiceImpl.findByUserId(
				new PageRequest(page - 1, 10),currentPrincipalName);
		if (page - 1 > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;	
	}
	
	@RequestMapping(value = "/syncsdistrictdate/get", method = RequestMethod.GET)
	public Page<Sync> findByDistrictIdDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "district", required = true) Long district_id,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until
					) throws Exception {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Sync> pageSync = syncServiceImpl.findByDistrictId(district_id,
				new PageRequest(page - 1, size),date_from,date_until);
		if (page - 1 > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;	
	}
	
	@RequestMapping(value = "/syncsdate/get", method = RequestMethod.GET)
	public Page<Sync> findByDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until
					) throws Exception {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Sync> pageSync = syncServiceImpl.findAllByDate(
				new PageRequest(page - 1, size),date_from,date_until);
		if (page - 1 > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;	
	}
	
	@RequestMapping(value = "/syncsserverdate/get", method = RequestMethod.GET)
	public Page<Sync> findByServerIdDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "server", required = true) Long server_id,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until
					) throws Exception {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Sync> pageSync = syncServiceImpl.findByServerId(server_id,
				new PageRequest(page - 1, size),date_from,date_until);
		if (page - 1 > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;	
	}
	
	@RequestMapping(value = "/syncsuserdate/get", method = RequestMethod.GET)
	public Page<Sync> findByUserIdDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until
					) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Sync> pageSync = syncServiceImpl.findByUserId(
				new PageRequest(page - 1, size),date_from,date_until,currentPrincipalName);

		if (page - 1 > pageSync.getTotalPages()) {
			throw new Exception();
		}
		return pageSync;	
	}

	@RequestMapping(value = "/syncs/{uuid}", method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public Object deleteSync(@PathVariable String uuid) throws Exception {
		Sync sync = null;
		try {
			sync = syncServiceImpl.findByUuid(uuid);
			syncServiceImpl.delete(sync);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return sync;
	}

	@RequestMapping(value = "/syncs", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public String update(@RequestBody Sync sync) throws Exception {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

}
