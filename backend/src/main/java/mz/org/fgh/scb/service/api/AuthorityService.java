package mz.org.fgh.scb.service.api;

import java.util.List;

import mz.org.fgh.scb.model.entity.Authority;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface AuthorityService {

	List<Authority> findAllByOrderByNameAsc();

}
