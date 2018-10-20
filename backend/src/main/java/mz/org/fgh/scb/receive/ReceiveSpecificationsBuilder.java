/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.receive;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes
 *
 */
public class ReceiveSpecificationsBuilder {

	private final List<SearchCriteria> params;

	public ReceiveSpecificationsBuilder() {
		params = new ArrayList<SearchCriteria>();
	}

	public ReceiveSpecificationsBuilder with(String key, String operation, Object value) {
		params.add(new SearchCriteria(key, operation, value));
		return this;
	}

	public Specification<Receive> build() {
		if (params.size() == 0) {
			return null;
		}

		List<Specification<Receive>> specs = new ArrayList<Specification<Receive>>();
		for (SearchCriteria param : params) {
			specs.add(new ReceiveSpecification(param));
		}

		Specification<Receive> result = specs.get(0);
		for (int i = 1; i < specs.size(); i++) {
			result = Specifications.where(result).and(specs.get(i));
		}
		return result;
	}
}
