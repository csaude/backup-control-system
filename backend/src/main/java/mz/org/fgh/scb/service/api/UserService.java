package mz.org.fgh.scb.service.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.User;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface UserService {

	User findByUuid(String uuid);

	User findByUsername(String username);

	Page<User> findAll(Specification<User> spec, PageRequest pageRequest);

	User save(User user);

	void delete(User user);

}
