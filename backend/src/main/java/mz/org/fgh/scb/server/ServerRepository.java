package mz.org.fgh.scb.server;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface ServerRepository extends JpaRepository<Server, Long>, JpaSpecificationExecutor<Server> {

	Server findOneByUid(String uuid);

}
