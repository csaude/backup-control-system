package mz.org.fgh.scb.person;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface PersonRepository extends JpaRepository<Person, Long> {

	Person findOneByUid(String uuid);

}
