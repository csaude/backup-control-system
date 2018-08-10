package mz.org.fgh.scb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mz.org.fgh.scb.model.entity.Evaluation;

/**
 * @author damasceno.lopes
 *
 */
public interface EvaluationRepository extends JpaRepository<Evaluation, Long>, JpaSpecificationExecutor<Evaluation> {

	List<Evaluation> findAllByOrderByNameAsc();

	Evaluation findByUuid(String uuid);

}
