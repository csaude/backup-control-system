package mz.org.fgh.scb.authority;

import java.util.List;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface AuthorityService {

	List<Authority> findAllByOrderByNameAsc();

}
