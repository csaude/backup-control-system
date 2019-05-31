package mz.org.fgh.scb.district;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface DistrictService {

	District save(District district);

	void delete(District district);

	District findOneByUuid(String uuid);

	Page<District> findAll(Specification<District> spec, PageRequest pageRequest);
}
