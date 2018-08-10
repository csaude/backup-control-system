package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Ironkey;

/**
 * @author damasceno.lopes
 *
 */
public interface IronkeyRepository extends JpaRepository<Ironkey, Long>, JpaSpecificationExecutor<Ironkey> {

	List<Ironkey> findAllByOrderBySerialAsc();

	Ironkey findByUuid(String uuid);

}
