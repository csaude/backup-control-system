/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.transporter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Damasceno Lopes
 *
 */
public interface TransporterRepository extends JpaRepository<Transporter, Long>, JpaSpecificationExecutor<Transporter> {

	Transporter findOneByUid(String uuid);

}
