/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;
import mz.org.fgh.scb.model.entity.Evaluation;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public class EvaluationSpecificationsBuilder {
	
	 private final List<SearchCriteria> params;
	 
	    public EvaluationSpecificationsBuilder() {
	        params = new ArrayList<SearchCriteria>();
	    }
	 
	    public EvaluationSpecificationsBuilder with(String key, String operation, Object value) {
	        params.add(new SearchCriteria(key, operation, value));
	        return this;
	    }
	 
	    public Specification<Evaluation> build() {
	        if (params.size() == 0) {
	            return null;
	        }
	 
	        List<Specification<Evaluation>> specs = new ArrayList<Specification<Evaluation>>();
	        for (SearchCriteria param : params) {
	            specs.add(new EvaluationSpecification(param));
	        }
	 
	        Specification<Evaluation> result = specs.get(0);
	        for (int i = 1; i < specs.size(); i++) {
	            result = Specifications.where(result).and(specs.get(i));
	        }
	        return result;
	    }
}
