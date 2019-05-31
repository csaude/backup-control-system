package mz.org.fgh.scb.sync;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface SyncRepository extends JpaRepository<Sync, Long>, JpaSpecificationExecutor<Sync> {

	Sync findOneByUid(String uuid);

}
