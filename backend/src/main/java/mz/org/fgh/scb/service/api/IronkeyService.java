package mz.org.fgh.scb.service.api;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Ironkey;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface IronkeyService {

	Page<Ironkey> findAll(Specification<Ironkey> spec, PageRequest pageRequest);
	
	List<Ironkey> findAllByOrderBySerialAsc();

	Ironkey findByUuid(String uuid);

	Ironkey save(Ironkey ironkey);

	void delete(Ironkey ironkey);

}
