package mz.org.fgh.scb.service.api;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Transporter;

/**
 * 
 * @author damasceno.lopes
 */
public interface TransporterService {

	List<Transporter> findAllByOrderByNameAsc();

	Transporter findByUuid(String uuid);

	Page<Transporter> findAll(Specification<Transporter> spec, PageRequest pageRequest);

	Transporter save(Transporter transporter);

	void delete(Transporter transporter);

}
