/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.model.entity.Sync;

public class SyncSpecificationsBuilder {
	
	 private final List<SearchCriteria> params;
	 
	    public SyncSpecificationsBuilder() {
	        params = new ArrayList<SearchCriteria>();
	    }
	 
	    public SyncSpecificationsBuilder with(String key, String operation, Object value) {
	        params.add(new SearchCriteria(key, operation, value));
	        return this;
	    }
	 
	    public Specification<Sync> build() {
	        if (params.size() == 0) {
	            return null;
	        }
	 
	        List<Specification<Sync>> specs = new ArrayList<Specification<Sync>>();
	        for (SearchCriteria param : params) {
	            specs.add(new SyncSpecification(param));
	        }
	 
	        Specification<Sync> result = specs.get(0);
	        for (int i = 1; i < specs.size(); i++) {
	            result = Specifications.where(result).and(specs.get(i));
	        }
	        return result;
	    }
}