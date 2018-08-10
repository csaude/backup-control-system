package mz.org.fgh.scb.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mz.org.fgh.scb.model.entity.Authority;
import mz.org.fgh.scb.repository.AuthorityRepository;
import mz.org.fgh.scb.service.api.AuthorityService;

/**
 * @author damasceno.lopes
 *
 */
@Service
public class AuthorityServiceImpl implements AuthorityService {

	@Autowired
	AuthorityRepository authorityRepository;

	@Override
	public List<Authority> findAllByOrderByNameAsc() {
		return authorityRepository.findAllByOrderByNameAsc();
	}

}
