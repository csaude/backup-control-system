package mz.org.fgh.scb.ironkey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface IronkeyRepository extends JpaRepository<Ironkey, Long>, JpaSpecificationExecutor<Ironkey> {

	Ironkey findOneByUid(String uuid);

}
