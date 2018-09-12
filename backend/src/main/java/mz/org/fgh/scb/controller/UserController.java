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

import io.swagger.annotations.Api;
import mz.org.fgh.scb.exception.SearchControllerException;
import mz.org.fgh.scb.model.entity.User;
import mz.org.fgh.scb.page.PageRequestBuilder;
import mz.org.fgh.scb.service.impl.UserServiceImpl;
import mz.org.fgh.scb.specification.UserSpecificationsBuilder;

/**
 * Defines the rest endpoint configuration for users
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = {"User"})
public class UserController {

	@Autowired
	private UserServiceImpl userServiceImpl;
	
	/**
	 * @return User authenticated
	 */
	@GetMapping(value = "/authenticate")
	public User authenticate() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = authentication.getName();
		return userServiceImpl.authenticate(loggedUsername);
	}

	/**
	 * @param filterCriteria  the filterCriteria
	 * @param sortingCriteria the sortingCriteria
	 * @param pageNumber      the pageNumber
	 * @param pageSize        the pageSize
	 * @return Send records paginated
	 * @throws Exception on bad request
	 */
	@GetMapping(value = "/users")
	public Page<User> findUsers(@RequestParam(value = "filterCriteria", required = false) String filterCriteria, @RequestParam(value = "sortingCriteria", required = false) String sortingCriteria,
			@RequestParam(value = "pageNumber", required = true) String pageNumber, @RequestParam(value = "pageSize", required = true) String pageSize) throws Exception {
		UserSpecificationsBuilder builder = new UserSpecificationsBuilder();
		Pattern pattern = Pattern.compile("(\\w+?)(=eq:|=like:|!)(\\w+?),");
		Matcher matcher = pattern.matcher(filterCriteria + ",");
		while (matcher.find()) {
			builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
		}
		Specification<User> spec = builder.build();
		PageRequest pageRequest = PageRequestBuilder.getPageRequest(pageSize, pageNumber, sortingCriteria);
		Page<User> pageUser = userServiceImpl.findAll(spec, pageRequest);
		if (pageNumber != null) {
			if (Integer.valueOf(pageNumber + "") > pageUser.getTotalPages()) {
				throw new SearchControllerException("Could not retrieve results, update the filter criteria or contact the System Administrator.");
			}
		}
		return pageUser;
	}

	/**
	 * @param user the user
	 * @return Success or error
	 */
	@PostMapping(value = "/user")
	@ResponseBody
	public String createUser(
			@RequestBody User user) {
		try {
			userServiceImpl.save(user);
			return "Success";
		} catch (Exception ex) {
			ex.printStackTrace();
			return "Error";
		}
	}

	/**
	 * @param uuid the User uuid
	 * @return the User with the given uuid
	 * @throws Exception
	 */
	@GetMapping(value = "/user/{uuid}")
	public User findOneUserByUuid(
			@PathVariable String uuid) throws Exception {
		return userServiceImpl.findOneByUuid(uuid);
	}

	/**
	 * @param uuid the User uuid
	 * @return the User deleted
	 * @throws Exception
	 */
	@DeleteMapping(value = "/user/{uuid}")
	@ResponseBody
	public String deleteUser(@PathVariable String uuid) throws Exception {
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

	/**
	 * @param user the User
	 * @param creator the User wich created this User
	 * @param updater the User that are updating this User
	 * @return Success or error
	 * @throws Exception
	 */
	@PutMapping(value = "/user/{creator}/{updater}")
	@ResponseBody
	public Object updateUser(@RequestBody User user, @PathVariable Long creator,@PathVariable Long updater) throws Exception {

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
