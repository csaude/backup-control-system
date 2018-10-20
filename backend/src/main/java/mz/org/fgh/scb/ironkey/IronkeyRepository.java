/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.ironkey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes
 *
 */
public interface IronkeyRepository extends JpaRepository<Ironkey, Long>, JpaSpecificationExecutor<Ironkey> {

	Ironkey findOneByUid(String uuid);

}
