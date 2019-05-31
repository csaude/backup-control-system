package mz.org.fgh.scb.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public class UserSpecificationsBuilder {

	private final List<SearchCriteria> params;

	public UserSpecificationsBuilder() {
		params = new ArrayList<SearchCriteria>();
	}

	public UserSpecificationsBuilder with(String key, String operation, Object value) {
		params.add(new SearchCriteria(key, operation, value));
		return this;
	}

	public Specification<User> build() {
		if (params.size() == 0) {
			return null;
		}

		List<Specification<User>> specs = new ArrayList<Specification<User>>();
		for (SearchCriteria param : params) {
			specs.add(new UserSpecification(param));
		}

		Specification<User> result = specs.get(0);
		for (int i = 1; i < specs.size(); i++) {
			result = Specifications.where(result).and(specs.get(i));
		}
		return result;
	}
}
