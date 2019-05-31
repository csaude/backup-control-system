package mz.org.fgh.scb.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

	User findOneByUid(String uuid);

	User findOneByUsername(String username);

}
