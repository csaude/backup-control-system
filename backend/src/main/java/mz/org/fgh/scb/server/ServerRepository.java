/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.server;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes
 *
 */
public interface ServerRepository extends JpaRepository<Server, Long>, JpaSpecificationExecutor<Server> {

	Server findOneByUid(String uuid);

}
