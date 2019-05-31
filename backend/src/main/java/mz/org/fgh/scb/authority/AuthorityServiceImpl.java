package mz.org.fgh.scb.authority;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Service
public class AuthorityServiceImpl implements AuthorityService {

	@Autowired
	AuthorityRepository authorityRepository;

	@Transactional(readOnly = true)
	@Override
	public List<Authority> findAllByOrderByNameAsc() {
		return authorityRepository.findAllByOrderByNameAsc();
	}

}
