package mz.org.fgh.scb.ironkey;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.filter.FilterOperation;
import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public class IronkeySpecification implements Specification<Ironkey> {

	private SearchCriteria criteria;

	public IronkeySpecification(final SearchCriteria criteria) {
		super();
		this.criteria = criteria;
	}

	@Override
	public Predicate toPredicate(final Root<Ironkey> root, final CriteriaQuery<?> query, final CriteriaBuilder builder) {

		if (criteria.getOperation().equalsIgnoreCase(FilterOperation.CONTAINS.toString())) {
			if (root.get(criteria.getKey()).getJavaType() == String.class) {
				return builder.like(root.<String>get(criteria.getKey()), "%" + criteria.getValue() + "%");
			} else {
				return builder.equal(root.get(criteria.getKey()), criteria.getValue());
			}
		} else if (criteria.getOperation().equalsIgnoreCase(FilterOperation.EQUAL.toString())) {
			return builder.equal(root.<String>get(criteria.getKey()), criteria.getValue());

		}
		return null;
	}

}
