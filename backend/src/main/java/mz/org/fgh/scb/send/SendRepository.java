package mz.org.fgh.scb.send;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface SendRepository extends JpaRepository<Send, Long>, JpaSpecificationExecutor<Send> {

	Send findOneByUid(String uuid);

}
