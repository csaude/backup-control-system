package mz.org.fgh.scb.sync;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface SyncService {

	Sync save(Sync sync);

	void delete(Sync sync);

	Sync findOneByUuid(String uuid);

	Page<Sync> findAll(Specification<Sync> spec, PageRequest pageRequest);
}
