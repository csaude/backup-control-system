package mz.org.fgh.scb.receive;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import mz.org.fgh.scb.exception.ItemNotFoundException;
import mz.org.fgh.scb.filter.PageRequestBuilder;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "Receive" })
public class ReceiveController {

	@Autowired
	private ReceiveServiceImpl receiveServiceImpl;

	@GetMapping(value = "/v1/receives")
	public Page<Receive> findReceives(
			@RequestParam(value = "fields", required = true) String fields, 
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = true) String page, 
			@RequestParam(value = "pageSize", required = true) String pageSize)
			throws Exception {
		ReceiveSpecificationsBuilder builder = new ReceiveSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:gte:|:lte:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Receive> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<Receive> pageReceive = receiveServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (page != null) {
				if (Integer.valueOf(page + "") > pageReceive.getTotalPages()) {
					throw new Exception();
				}
			}
		}


		return pageReceive;
	}

	@PostMapping(value = "/v1/receives")
	@ResponseBody
	public String createReceive(@RequestBody Receive receive) {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/v1/receives/{uuid}")
	public Receive findOneReceiveByUuid(@PathVariable String uuid) {		
		Receive receive=receiveServiceImpl.findOneByUuid(uuid);
		if (receive == null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
			return receive;	
	}

	@GetMapping(value = "/v1/receives/send/{uuid}")
	public Receive findOneReceiveBySendUuid(@PathVariable String uuid) {
		Receive receive=receiveServiceImpl.findOneBySendUuid(uuid);
		if (receive == null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
			return receive;
	}

	@DeleteMapping(value = "/v1/receives/{uuid}")
	@ResponseBody
	public Object deleteReceive(@PathVariable String uuid) {
		Receive receive = null;
		try {
			receive = receiveServiceImpl.findOneByUuid(uuid);
			receiveServiceImpl.delete(receive);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return receive;
	}

	@PutMapping(value = "/v1/receives")
	@ResponseBody
	public String updateReceive(@RequestBody Receive receive) {
		try {
			receiveServiceImpl.save(receive);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
