package mz.org.fgh.scb.service.api;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Server;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface ServerService {

	Page<Server> findAll(Specification<Server> spec, PageRequest pageRequest);
	
	List<Server> findAllByOrderByNameAsc();
	
	List<Server> findByDistrictId(Long district_id);
	
	List<Server> findByUserId(String username);
	
	List<Object[]> findLastSyncsByServer();
	
	List<Object[]> findSyncsOfPreviousWeek();
	
	List<Object[]> findSyncsOfThisWeek();
	
	List<Object[]> findSyncsItemsOfThisWeek();
	
	List<Object[]> findSyncsItemsOfPreviousWeek();
	
	Server findByUuid(String uuid);

	Server save(Server ironkey);

	void delete(Server ironkey);

}
