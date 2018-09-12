/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.page;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;

/**
 * Custom Page request builder
 * 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public final class PageRequestBuilder {

	private PageRequestBuilder() {
		// Do nothing
	}

	public static PageRequest getPageRequest(Object pageSize, Object pageNumber, String sortingCriteria) {
		
        //Some Entitys can query withou pageNumber and pageSize
		if (pageSize != null) {
			pageSize=Integer.valueOf(pageSize+"");
		}

		if (pageSize != null) {
			pageNumber=Integer.valueOf(pageNumber+"");
		}
		Set<String> sortingFileds = new LinkedHashSet<>(Arrays.asList(StringUtils.split(StringUtils.defaultIfEmpty(sortingCriteria, ""), ",")));
		List<Order> sortingOrders = sortingFileds.stream().map(PageRequestBuilder::getOrder).collect(Collectors.toList());
		Sort sort = sortingOrders.isEmpty() ? null : new Sort(sortingOrders);

		return new PageRequest((int) ObjectUtils.defaultIfNull(pageNumber, 1) - 1, (int) ObjectUtils.defaultIfNull(pageSize, Integer.MAX_VALUE), sort);
	}

	private static Order getOrder(String value) {

		if (StringUtils.startsWith(value, "-")) {
			return new Order(Direction.DESC, StringUtils.substringAfter(value, "-"));
		} else if (StringUtils.startsWith(value, "+")) {
			return new Order(Direction.ASC, StringUtils.substringAfter(value, "+"));
		} else {
			// Sometimes '+' from query param can be replaced as ' '
			return new Order(Direction.ASC, StringUtils.trim(value));
		}

	}

}
