package mz.org.fgh.scb.ironkey;

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
@Api(tags = { "Ironkey" })
public class IronkeyController {

	@Autowired
	private IronkeyServiceImpl ironkeyServiceImpl;

	@GetMapping(value = "/v1/ironkeys")
	public Page<Ironkey> findIronkeys(
			@RequestParam(value = "fields", required = true) String fields, 
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = false) String page, 
			@RequestParam(value = "pageSize", required = false) String pageSize) throws Exception {
		IronkeySpecificationsBuilder builder = new IronkeySpecificationsBuilder();
		if(page == null || page.isEmpty() || pageSize == null || pageSize.isEmpty()) {
			page = null;
			pageSize = null;
		}
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:like:)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<Ironkey> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<Ironkey> pageIronkey = ironkeyServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (page != null) {
				if (Integer.valueOf(page + "") > pageIronkey.getTotalPages()) {
					throw new Exception();
				}
			}
		}
		
		return pageIronkey;
		
	}

	@PostMapping(value = "/v1/ironkeys")
	@ResponseBody
	public String createIronkey(@RequestBody Ironkey ironkey) {
		try {
			ironkeyServiceImpl.save(ironkey);
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
		return "Success";
	}

	@GetMapping(value = "/v1/ironkeys/{uuid}")
	public Ironkey findOneIronkeyByUuid(@PathVariable String uuid){
		Ironkey ironkey =ironkeyServiceImpl.findOneByUuid(uuid);
		if (ironkey==null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
		return ironkey;
	}

	@DeleteMapping(value = "/v1/ironkeys/{uuid}")
	@ResponseBody
	public String deleteIronkey(@PathVariable String uuid){
		Ironkey ironkey = null;
		try {
			ironkey = ironkeyServiceImpl.findOneByUuid(uuid);
			ironkeyServiceImpl.delete(ironkey);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@PutMapping(value = "/v1/ironkeys")
	@ResponseBody
	public String updateIronkey(@RequestBody Ironkey ironkey){
		try {
			ironkeyServiceImpl.save(ironkey);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Erro";
		}
	}
}
