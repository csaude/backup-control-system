/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.receive;

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

import mz.org.fgh.scb.district.District;
import mz.org.fgh.scb.filter.FilterOperation;
import mz.org.fgh.scb.filter.SearchCriteria;
import mz.org.fgh.scb.user.User;

/**
 * @author Damasceno Lopes
 *
 */
public class ReceiveSpecification implements Specification<Receive> {

	private SearchCriteria criteria;

	public ReceiveSpecification(final SearchCriteria criteria) {
		super();
		this.criteria = criteria;
	}

	@Override
	public Predicate toPredicate(final Root<Receive> root, final CriteriaQuery<?> query, final CriteriaBuilder builder) {

		if (criteria.getOperation().equalsIgnoreCase(FilterOperation.GREATER_THAN_OR_EQUAL_TO.toString())) {
			if (criteria.getKey().equals("backupDate")) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				try {
					return builder.greaterThanOrEqualTo(root.<Date>get("send").get("backupdate"), dateFormat.parse(criteria.getValue().toString()));
				} catch (ParseException e) {
					e.printStackTrace();
				}
			} else {
				return builder.greaterThanOrEqualTo(root.<String>get(criteria.getKey()), criteria.getValue().toString());
			}
		} else if (criteria.getOperation().equalsIgnoreCase(FilterOperation.LESS_THAN_OR_EQUAL_TO.toString())) {
			if (criteria.getKey().equals("backupDate")) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				try {
					return builder.lessThanOrEqualTo(root.<Date>get("send").get("backupdate"), dateFormat.parse(criteria.getValue().toString()));
				} catch (ParseException e) {
					e.printStackTrace();
				}
			} else {
				return builder.lessThanOrEqualTo(root.<String>get(criteria.getKey()), criteria.getValue().toString());
			}
		} else if (criteria.getOperation().equalsIgnoreCase(FilterOperation.EQUAL.toString())) {
			if (criteria.getKey().equalsIgnoreCase("district"))
				return builder.equal(root.get("send").get("district").get("districtId"), criteria.getValue().toString());
			else
				return builder.equal(root.<String>get(criteria.getKey()), criteria.getValue());
		}

		else if (criteria.getOperation().equalsIgnoreCase("!")) {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String loggedUsername = authentication.getName();

			Root<Receive> Receive = root;
			Subquery<User> userSubQuery = query.subquery(User.class);
			Root<User> user = userSubQuery.from(User.class);
			Expression<Set<District>> userDistricts = user.get("districts");
			userSubQuery.select(user);
			userSubQuery.where(builder.equal(user.get("username"), loggedUsername), builder.isMember(Receive.get("district"), userDistricts));
			return builder.exists(userSubQuery);
		}
		return null;
	}

}
