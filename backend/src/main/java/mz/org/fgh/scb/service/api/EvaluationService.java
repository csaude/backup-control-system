package mz.org.fgh.scb.service.api;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Evaluation;

/**
 * 
 * @author damasceno.lopes
 *
 */
public interface EvaluationService {

	List<Evaluation> findAllByOrderByNameAsc();

	Evaluation findByUuid(String uuid);

	Page<Evaluation> findAll(Specification<Evaluation> spec, PageRequest pageRequest);

	Evaluation save(Evaluation evaluation);

	void delete(Evaluation evaluation);

}
