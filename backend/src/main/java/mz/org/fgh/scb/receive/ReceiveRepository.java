/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.receive;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * @author Damasceno Lopes
 *
 */
public interface ReceiveRepository extends JpaRepository<Receive, Long>, JpaSpecificationExecutor<Receive> {

	Receive findOneByUid(String uuid);

	@Query("SELECT r FROM receive r JOIN r.send s WHERE s.uid=:uuid AND s.canceled=0 AND r.canceled=0")
	public Receive findOneBySendUuid(@Param("uuid") String uuid);

	
}
