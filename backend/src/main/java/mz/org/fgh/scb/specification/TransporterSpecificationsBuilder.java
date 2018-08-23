/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.model.entity.Transporter;

public class TransporterSpecificationsBuilder {
	
	 private final List<SearchCriteria> params;
	 
	    public TransporterSpecificationsBuilder() {
	        params = new ArrayList<SearchCriteria>();
	    }
	 
	    public TransporterSpecificationsBuilder with(String key, String operation, Object value) {
	        params.add(new SearchCriteria(key, operation, value));
	        return this;
	    }
	 
	    public Specification<Transporter> build() {
	        if (params.size() == 0) {
	            return null;
	        }
	 
	        List<Specification<Transporter>> specs = new ArrayList<Specification<Transporter>>();
	        for (SearchCriteria param : params) {
	            specs.add(new TransporterSpecification(param));
	        }
	 
	        Specification<Transporter> result = specs.get(0);
	        for (int i = 1; i < specs.size(); i++) {
	            result = Specifications.where(result).and(specs.get(i));
	        }
	        return result;
	    }
}
