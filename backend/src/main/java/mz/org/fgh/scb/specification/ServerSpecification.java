package mz.org.fgh.scb.specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import mz.org.fgh.scb.model.entity.Server;

public class ServerSpecification implements Specification<Server> {
	
	private SearchCriteria criteria;

	/**
	 * @param criteria {@link SearchCriteria}
	 */
	public ServerSpecification(final SearchCriteria criteria) {
		super();
		this.criteria = criteria;
	}

	@Override
	public Predicate toPredicate(final Root<Server> root, final CriteriaQuery<?> query, final CriteriaBuilder builder) {
		if (criteria.getOperation().equalsIgnoreCase("!")) {
            return builder.equal(
              root.<String> get(criteria.getKey()), criteria.getValue());
        } 
        else if (criteria.getOperation().equalsIgnoreCase("<")) {
            return builder.lessThanOrEqualTo(
              root.<String> get(criteria.getKey()), criteria.getValue().toString());
        } 
        else if (criteria.getOperation().equalsIgnoreCase(":")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return builder.like(
                  root.<String>get(criteria.getKey()), "%" + criteria.getValue() + "%");
            } else {
                return builder.equal(root.get(criteria.getKey()), criteria.getValue());
            }
        }
    	
        else if (criteria.getOperation().equalsIgnoreCase("~")) {
            return builder.equal(root.get("district").get("district_id"), criteria.getValue().toString());
           
    }
		
		return null;
	}


}
