package mz.org.fgh.scb.authority;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface AuthorityRepository extends JpaRepository<Authority, Long> {

	public List<Authority> findAllByOrderByNameAsc();

}
