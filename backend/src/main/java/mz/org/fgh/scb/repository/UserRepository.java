package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.User;

/**
 * @author damasceno.lopes
 *
 */
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

	User findOneByUsername(String username);
	
	List<User> findAllByOrderByUsernameAsc();
	
	User findByUuid(String uuid);

}
