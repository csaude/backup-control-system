/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.specification;

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
import mz.org.fgh.scb.model.entity.User;

public class DistrictSpecification implements Specification<District> {
	
	private SearchCriteria criteria;

	/**
	 * @param criteria {@link SearchCriteria}
	 */
	public DistrictSpecification(final SearchCriteria criteria) {
		super();
		this.criteria = criteria;
	}

	@Override
	public Predicate toPredicate(final Root<District> root, final CriteriaQuery<?> query, final CriteriaBuilder builder) {
		
		if (criteria.getOperation().equalsIgnoreCase(">")) {
            return builder.greaterThanOrEqualTo(
              root.<String> get(criteria.getKey()), criteria.getValue().toString());
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
            return builder.equal(
              root.<String>get(criteria.getKey()),criteria.getValue()); 
        }
        else if (criteria.getOperation().equalsIgnoreCase("!")) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		
		if(authentication.getAuthorities().toString().contains("ROLE_SIS")||authentication.getAuthorities().toString().contains("ROLE_GMA")||authentication.getAuthorities().toString().contains("OA")||authentication.getAuthorities().toString().contains("IT")) {
			
		}else {
		
		 Root<District> district = root;
         Subquery<User> userSubQuery = query.subquery(User.class);
         Root<User> user = userSubQuery.from(User.class);
         Expression<Set<District>> userDistricts = user.get("districts");
         userSubQuery.select(user);
         userSubQuery.where(builder.equal(user.get("username"), currentPrincipalName), builder.isMember(district, userDistricts));
         
         return builder.exists(userSubQuery);
		
		}
        }
		return null;
	}


}
