/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.authority;

import java.util.List;

/**
 * @author Damasceno Lopes
 *
 */
public interface AuthorityService {

	List<Authority> findAllByOrderByNameAsc();

}
