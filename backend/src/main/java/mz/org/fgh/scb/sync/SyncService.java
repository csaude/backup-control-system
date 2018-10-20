/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.sync;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes
 *
 */
public interface SyncService {

	Sync save(Sync sync);

	void delete(Sync sync);

	Sync findOneByUuid(String uuid);

	Page<Sync> findAll(Specification<Sync> spec, PageRequest pageRequest);
}
