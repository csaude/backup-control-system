/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.specification;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import mz.org.fgh.scb.model.entity.District;
import mz.org.fgh.scb.model.entity.Send;
import mz.org.fgh.scb.model.entity.User;

public class SendSpecification implements Specification<Send> {
	
	private SearchCriteria criteria;

	/**
	 * @param criteria {@link SearchCriteria}
	 */
	public SendSpecification(final SearchCriteria criteria) {
		super();
		this.criteria = criteria;
	}

	@Override
	public Predicate toPredicate(final Root<Send> root, final CriteriaQuery<?> query, final CriteriaBuilder builder) {
		
		 SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		
		if (criteria.getOperation().equalsIgnoreCase(">")) {
            try {
				return builder.greaterThanOrEqualTo(
				  root.<Date> get(criteria.getKey()), dateFormat.parse(criteria.getValue().toString()) );
			} catch (ParseException e) {
				e.printStackTrace();
			}
        } 
        else if (criteria.getOperation().equalsIgnoreCase("<")) {
            try {
				return builder.lessThanOrEqualTo(
				  root.<Date> get(criteria.getKey()), dateFormat.parse(criteria.getValue().toString()));
			} catch (ParseException e) {
				e.printStackTrace();
			}
        } 
        else if (criteria.getOperation().equalsIgnoreCase("~")) {
            return builder.equal(root.<String>get(criteria.getKey()),criteria.getValue());   
        }
		
        else if (criteria.getOperation().equalsIgnoreCase(":")) {
            return builder.equal(root.get("district").get("district_id"), criteria.getValue().toString());
           
        }
        else if (criteria.getOperation().equalsIgnoreCase("!")) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		
		Root<Send> send = root;
        Subquery<User> userSubQuery = query.subquery(User.class);
        Root<User> user = userSubQuery.from(User.class);
        Expression<Set<District>> userDistricts = user.get("districts");
        userSubQuery.select(user);
        userSubQuery.where(builder.equal(user.get("username"), currentPrincipalName), builder.isMember(send.get("district"), userDistricts));
       
        return builder.exists(userSubQuery);
		
        }
		return null;
	}


}
