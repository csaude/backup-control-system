package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mz.org.fgh.scb.model.entity.Authority;

/**
 * @author damasceno.lopes
 *
 */
public interface AuthorityRepository extends JpaRepository<Authority, Long> {

	public List<Authority> findAllByOrderByNameAsc();

}
