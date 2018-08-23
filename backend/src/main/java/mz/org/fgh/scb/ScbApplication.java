/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;

/**
 * @author damasceno.lopes
 *
 */
@SpringBootApplication
public class ScbApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(ScbApplication.class, args);
	}

}
