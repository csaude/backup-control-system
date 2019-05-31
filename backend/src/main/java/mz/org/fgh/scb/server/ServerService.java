package mz.org.fgh.scb.server;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface ServerService {

	Server save(Server server);

	void delete(Server server);

	Server findOneByUuid(String uuid);

	Page<Server> findAll(Specification<Server> spec, PageRequest pageRequest);

}
