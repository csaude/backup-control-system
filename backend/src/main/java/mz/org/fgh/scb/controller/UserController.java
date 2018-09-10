/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

import mz.org.fgh.scb.model.entity.User;
import mz.org.fgh.scb.service.impl.UserServiceImpl;
import mz.org.fgh.scb.specification.UserSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for users
 * 
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
public class UserController {

	@Autowired
	private UserServiceImpl userServiceImpl;
	
	@GetMapping(value = "/authenticate")
	public User authenticate() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		return userServiceImpl.authenticate(currentPrincipalName);
	}

	@GetMapping(value = "/users")
	public Page<User> findAllPaginated(@RequestParam(value = "page", required = true) int page,@RequestParam(value = "size", required = true) int size,@RequestParam(value = "search", required = false) String search) throws Exception {
		UserSpecificationsBuilder builder = new UserSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:|!|>|<|~)(\\w+?),");
		Matcher matcher = pattern.matcher(search + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<User> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(10, page, "+username");
		Page<User> pageUser = userServiceImpl.findAll(spec, pageRequest);
		if (page > pageUser.getTotalPages()) {
			throw new Exception();
		}
		return pageUser;
	}

	@PostMapping(value = "/users")
	@ResponseBody
	public String create(
			@RequestBody User user) {
		try {
			userServiceImpl.save(user);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/users/{uuid}")
	public User getUser(
			@PathVariable String uuid) throws Exception {
		return userServiceImpl.findByUuid(uuid);
	}

	@DeleteMapping(value = "/users/{uuid}")
	@ResponseBody
	public String deleteUser(@PathVariable String uuid) throws Exception {
		User user = null;
		try {
			user = userServiceImpl.findByUuid(uuid);
			userServiceImpl.delete(user);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@PutMapping(value = "/users/{creator}/{updater}")
	@ResponseBody
	public Object update(@RequestBody User user, @PathVariable Long creator,@PathVariable Long updater) throws Exception {

		try {
			user.setCreated_by(userServiceImpl.findById(creator));
			user.setUpdated_by(userServiceImpl.findById(updater));
			userServiceImpl.save(user);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
