/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mz.org.fgh.scb.model.entity.Authority;
import mz.org.fgh.scb.service.impl.AuthorityServiceImpl;

/**
 * Defines the rest endpoint configuration for Authorities
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class AuthorityController {

	@Autowired
	private AuthorityServiceImpl authorityServiceImpl;

	@RequestMapping(value = "/authorities", method = RequestMethod.GET)
	public List<Authority> findAllByOrderByNameAsc() {
		return authorityServiceImpl.findAllByOrderByNameAsc();
	}
}
