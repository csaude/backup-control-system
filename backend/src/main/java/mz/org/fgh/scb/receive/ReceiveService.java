package mz.org.fgh.scb.receive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface ReceiveService {
	
	Receive save(Receive receive);

	void delete(Receive receive);

	Receive findOneByUuid(String uuid);

	Page<Receive> findAll(Specification<Receive> spec, PageRequest pageRequest);

	Receive findOneBySendUuid(String uuid);

}
