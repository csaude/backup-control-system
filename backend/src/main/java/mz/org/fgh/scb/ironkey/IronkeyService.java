package mz.org.fgh.scb.ironkey;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface IronkeyService {

	Ironkey save(Ironkey ironkey);

	void delete(Ironkey ironkey);

	Ironkey findOneByUuid(String uuid);

	Page<Ironkey> findAll(Specification<Ironkey> spec, PageRequest pageRequest);

}
