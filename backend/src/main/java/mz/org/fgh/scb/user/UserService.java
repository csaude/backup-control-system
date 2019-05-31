package mz.org.fgh.scb.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
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
