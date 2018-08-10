package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Transporter;

/**
 * @author damasceno.lopes
 *
 */
public interface TransporterRepository extends JpaRepository<Transporter, Long>, JpaSpecificationExecutor<Transporter> {

	List<Transporter> findAllByOrderByNameAsc();

	Transporter findByUuid(String uuid);

}
