package mz.org.fgh.scb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.service.impl.AuthorityServiceImpl;

/**
 * @author damasceno.lopes
 *
 */
@RestController
@RequestMapping("api")
public class AuthorityController {

	@Autowired
	private AuthorityServiceImpl authorityServiceImpl;

	@RequestMapping(value = "/authorities", method = RequestMethod.GET)
	public Object Index() {
		return authorityServiceImpl.findAllByOrderByNameAsc();
	}
}
