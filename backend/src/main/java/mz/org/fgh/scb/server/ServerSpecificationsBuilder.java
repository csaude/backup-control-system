/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.server;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes
 *
 */
public class ServerSpecificationsBuilder {

	private final List<SearchCriteria> params;

	public ServerSpecificationsBuilder() {
		params = new ArrayList<SearchCriteria>();
	}

	public ServerSpecificationsBuilder with(String key, String operation, Object value) {
		params.add(new SearchCriteria(key, operation, value));
		return this;
	}

	public Specification<Server> build() {
		if (params.size() == 0) {
			return null;
		}

		List<Specification<Server>> specs = new ArrayList<Specification<Server>>();
		for (SearchCriteria param : params) {
			specs.add(new ServerSpecification(param));
		}

		Specification<Server> result = specs.get(0);
		for (int i = 1; i < specs.size(); i++) {
			result = Specifications.where(result).and(specs.get(i));
		}
		return result;
	}
}
