package mz.org.fgh.scb.transporter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface TransporterService {

	Transporter save(Transporter transporter);

	void delete(Transporter transporter);

	Transporter findOneByUuid(String uuid);

	Page<Transporter> findAll(Specification<Transporter> spec, PageRequest pageRequest);

}
