/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes
 *
 */
public interface UserService {

	User save(User user);

	void delete(User user);

	User findOneByUuid(String uuid);
	
	User findOneById(Long id);

	User authenticate(String username);

	Page<User> findAll(Specification<User> spec, PageRequest pageRequest);

}
