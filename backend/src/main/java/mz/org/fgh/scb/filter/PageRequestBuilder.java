package mz.org.fgh.scb.filter;

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
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public final class PageRequestBuilder {

	private PageRequestBuilder() {

	}

	public static PageRequest getPageRequest(Object pageSize, Object page, String sortingCriteria) {
		if (pageSize != null) {
			pageSize = Integer.valueOf(pageSize + "");
			if(Integer.valueOf(pageSize + "")>2000) {
		    pageSize=2000;	
			}
		}

		if (pageSize != null) {
			page = Integer.valueOf(page + "");
		}
		
		Set<String> sortingFileds = new LinkedHashSet<>(Arrays.asList(StringUtils.split(StringUtils.defaultIfEmpty(sortingCriteria, ""), ",")));
		List<Order> sortingOrders = sortingFileds.stream().map(PageRequestBuilder::getOrder).collect(Collectors.toList());
		Sort sort = sortingOrders.isEmpty() ? null : new Sort(sortingOrders);

		return new PageRequest((int) ObjectUtils.defaultIfNull(page, 1) - 1, (int) ObjectUtils.defaultIfNull(pageSize, 2000), sort);
	}

	private static Order getOrder(String value) {

		if (StringUtils.startsWith(value, "-")) {
			return new Order(Direction.DESC, StringUtils.substringAfter(value, "-"));
		} else if (StringUtils.startsWith(value, "+")) {
			return new Order(Direction.ASC, StringUtils.substringAfter(value, "+"));
		} else {
			return new Order(Direction.ASC, StringUtils.trim(value));
		}

	}

}
