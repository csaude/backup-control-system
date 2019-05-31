package mz.org.fgh.scb.transporter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface TransporterRepository extends JpaRepository<Transporter, Long>, JpaSpecificationExecutor<Transporter> {

	Transporter findOneByUid(String uuid);

}
