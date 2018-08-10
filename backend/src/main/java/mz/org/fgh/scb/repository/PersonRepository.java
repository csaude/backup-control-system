package mz.org.fgh.scb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mz.org.fgh.scb.model.entity.Person;

/**
 * @author damasceno.lopes
 *
 */
public interface PersonRepository extends JpaRepository<Person, Long> {

	Person findByUuid(String uuid);

}
