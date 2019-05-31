package mz.org.fgh.scb.sync;

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
@Api(tags = { "Sync" })
public class SyncController {

	@Autowired
	private SyncServiceImpl syncServiceImpl;

	@GetMapping(value = "/v1/syncs")
	public Page<Sync> findSyncs(
			@RequestParam(value = "fields", required = true) String fields,
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = true) String page, 
			@RequestParam(value = "pageSize", required = true) String pageSize)
			throws Exception {

		SyncSpecificationsBuilder builder = new SyncSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:gte:|:lte:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Sync> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<Sync> pageSync = syncServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (Integer.valueOf(page + "") > pageSync.getTotalPages()) {
				throw new Exception();
			}
		}
		
		return pageSync;
		
	}

	@PostMapping(value = "/v1/syncs")
	@ResponseBody
	public String createSync(@RequestBody Sync sync) {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/v1/syncs/{uuid}")
	public Sync findOneSyncByUuid(@PathVariable String uuid) {
		Sync sync = syncServiceImpl.findOneByUuid(uuid);
		if (sync == null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
			return sync;
	}

	@DeleteMapping(value = "/v1/syncs/{uuid}")
	@ResponseBody
	public Object deleteSync(@PathVariable String uuid) {
		Sync sync = null;
		try {
			sync = syncServiceImpl.findOneByUuid(uuid);
			syncServiceImpl.delete(sync);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return sync;
	}

	@PutMapping(value = "/v1/syncs")
	@ResponseBody
	public String updateSync(@RequestBody Sync sync) {
		try {
			syncServiceImpl.save(sync);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
