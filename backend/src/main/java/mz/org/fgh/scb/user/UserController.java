/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.user;

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

import io.swagger.annotations.Api;
import mz.org.fgh.scb.exception.ItemNotFoundException;
import mz.org.fgh.scb.filter.PageRequestBuilder;

/**
 * @author Damasceno Lopes
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = { "User" })
public class UserController {

	@Autowired
	private UserServiceImpl userServiceImpl;

	@GetMapping(value = "/v1/authenticate")
	public User authenticate() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = authentication.getName();
		return userServiceImpl.authenticate(loggedUsername);
	}

	@GetMapping(value = "/v1/users")
	public Page<User> findUsers(
			@RequestParam(value = "fields", required = true) String fields, 
			@RequestParam(value = "filter", required = false) String filter, 
			@RequestParam(value = "order", required = false) String order,
			@RequestParam(value = "page", required = true) String page, 
			@RequestParam(value = "pageSize", required = true) String pageSize)
			throws Exception {
		UserSpecificationsBuilder builder = new UserSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(:eq:|:like:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filter + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<User> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, page, order);
		Page<User> pageUser = userServiceImpl.findAll(spec, pageRequest);
		if (page != null) {
			if (Integer.valueOf(page + "") > pageUser.getTotalPages()) {
				throw new Exception();
			}
		}

		return pageUser;
	}

	@PostMapping(value = "/v1/users")
	@ResponseBody
	public String createUser(@RequestBody User user) {
		try {
			userServiceImpl.save(user);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@GetMapping(value = "/v1/users/{uuid}")
	public User findOneUserByUuid(@PathVariable String uuid) {
		User user = userServiceImpl.findOneByUuid(uuid);
		if (user == null)
			throw new ItemNotFoundException("The given uuid dont exist on the database");
		else
			return user;
	}

	@DeleteMapping(value = "/v1/users/{uuid}")
	@ResponseBody
	public String deleteUser(@PathVariable String uuid) {
		User user = null;
		try {
			user = userServiceImpl.findOneByUuid(uuid);
			userServiceImpl.delete(user);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	@PutMapping(value = "/v1/users/{creator}/{updater}")
	@ResponseBody
	public Object updateUser(@RequestBody User user, @PathVariable Long creator, @PathVariable Long updater){
		try {
			user.setCreatedBy(userServiceImpl.findOneById(creator));
			user.setUpdatedBy(userServiceImpl.findOneById(updater));
			userServiceImpl.save(user);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}
}
