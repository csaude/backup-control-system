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

import mz.org.fgh.scb.model.entity.Receive;
import mz.org.fgh.scb.service.impl.ReceiveServiceImpl;

/**
 * @author damasceno.lopes
 *
 */
@RestController
@RequestMapping("api")
public class ReceiveController {

	@Autowired
	private ReceiveServiceImpl receiveServiceImpl;

	@RequestMapping(value = "/receivesdistrict/get", method = RequestMethod.GET)
	public Page<Receive> findByDistrictId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "district", required = true) Long district_id) throws Exception {
		Page<Receive> pageReceive = receiveServiceImpl.findByDistrictId(district_id,
				new PageRequest(page - 1, 10));
		if (page - 1 > pageReceive.getTotalPages()) {
			throw new Exception();
		}
		return pageReceive;
	}
	
	@RequestMapping(value = "/receivesuser/get", method = RequestMethod.GET)
	public Page<Receive> findByUserId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		Page<Receive> pageReceive = receiveServiceImpl.findByUserId(
				new PageRequest(page - 1, 10),currentPrincipalName);
		if (page - 1 > pageReceive.getTotalPages()) {
			throw new Exception();
		}
		return pageReceive;	
	}
	
	@RequestMapping(value = "/receivesall/get", method = RequestMethod.GET)
	public Page<Receive> findAllReceived(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size) throws Exception {
		Page<Receive> pageReceive = receiveServiceImpl.findAllReceived(
				new PageRequest(page - 1, 10));
		if (page - 1 > pageReceive.getTotalPages()) {
			throw new Exception();
		}
		return pageReceive;	
	}
	
	@RequestMapping(value = "/receivesdate/get", method = RequestMethod.GET)
	public Page<Receive> findAllByDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until) throws Exception {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Receive> pageReceive = receiveServiceImpl.findByDate(new PageRequest(page - 1, size),date_from,date_until);
		if (page - 1 > pageReceive.getTotalPages()) {
			throw new Exception();
		}
		return pageReceive;	
	}
	
	@RequestMapping(value = "/receivesdistrictdate/get", method = RequestMethod.GET)
	public Page<Receive> findByDistrictId(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "district", required = true) Long district_id,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until) throws Exception {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Receive> pageReceive = receiveServiceImpl.findByDistrictId(district_id,
				new PageRequest(page - 1, size),date_from,date_until);
		if (page - 1 > pageReceive.getTotalPages()) {
			throw new Exception();
		}
		return pageReceive;	
	}
	
	@RequestMapping(value = "/receivesuserdate/get", method = RequestMethod.GET)
	public Page<Receive> findByUserIdDate(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "from", required = true) String from,@RequestParam(value = "until", required = true) String until
					) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date_from = format.parse(from);
		Date date_until = format.parse(until);
		Page<Receive> pageReceive = receiveServiceImpl.findByUserId(
				new PageRequest(page - 1, 10),date_from,date_until,currentPrincipalName);
		if (page - 1 > pageReceive.getTotalPages()) {
			throw new Exception();
		}
		return pageReceive;	
	}

	@RequestMapping(value = "/receives", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public String create(@RequestBody Receive receive) {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@RequestMapping(value = "/receives/{uuid}", method = RequestMethod.GET)
	public Object getReceive(@PathVariable String uuid) throws Exception {
		return receiveServiceImpl.findByUuid(uuid);
	}
	
	@RequestMapping(value = "/receivessend/{send_id}", method = RequestMethod.GET)
	public Object getReceiveByid(@PathVariable Long send_id) throws Exception {
		return receiveServiceImpl.findBySendId(send_id);
	}

	@RequestMapping(value = "/receives/{uuid}", method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public Object deleteReceive(@PathVariable String uuid) throws Exception {
		Receive receive = null;
		try {
			receive = receiveServiceImpl.findByUuid(uuid);
			receiveServiceImpl.delete(receive);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return receive;
	}

	@RequestMapping(value = "/receives", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public String update(@RequestBody Receive receive) throws Exception {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
