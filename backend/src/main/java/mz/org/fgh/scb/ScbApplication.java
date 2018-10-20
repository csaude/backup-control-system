/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb;

import static springfox.documentation.builders.PathSelectors.regex;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.github.bohnman.squiggly.Squiggly;
import com.github.bohnman.squiggly.web.RequestSquigglyContextProvider;
import com.github.bohnman.squiggly.web.SquigglyRequestFilter;
import com.google.common.collect.Iterables;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author Damasceno Lopes
 *
 */
@SpringBootApplication
@EnableSwagger2
@Component
public class ScbApplication extends SpringBootServletInitializer {

	@Autowired
	ApplicationContext context;

	@Bean
	public FilterRegistrationBean squigglyRequestFilter() {
		FilterRegistrationBean filter = new FilterRegistrationBean();
		filter.setFilter(new SquigglyRequestFilter());
		filter.setOrder(1);
		return filter;
	}

	public static void main(String[] args) {

		SpringApplication.run(ScbApplication.class, args);

	}

	@PostConstruct
	public void init() {

		Iterable<ObjectMapper> objectMappers = context.getBeansOfType(ObjectMapper.class).values();

		Squiggly.init(objectMappers, new RequestSquigglyContextProvider() {
			@Override
			protected String customizeFilter(String filter, HttpServletRequest request, @SuppressWarnings("rawtypes") Class beanClass) {
				return filter;
			}
		});

		ObjectMapper objectMapper = Iterables.getFirst(objectMappers, null);

		// Enable Squiggly for Jackson message converter
		if (objectMapper != null) {
			for (MappingJackson2HttpMessageConverter converter : context.getBeansOfType(MappingJackson2HttpMessageConverter.class).values()) {
				converter.setObjectMapper(objectMapper);
			}
		}

	}

	@Bean
	public Docket productApi() {
		return new Docket(DocumentationType.SWAGGER_2).select().apis(RequestHandlerSelectors.basePackage("mz.org.fgh.scb")).paths(regex("/api.*")).build().apiInfo(metaData());
	}

	private ApiInfo metaData() {
		return new ApiInfoBuilder().title("SCB REST API").description("\"Description of SCB REST API\"").version("1.0.0").license("Apache License Version 2.0").licenseUrl("https://www.apache.org/licenses/LICENSE-2.0\"")
				.contact(new Contact("Damasceno Lopes", "", "damasceno.lopes@fgh.org.mz")).build();
	}

	protected void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");

		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

	@SuppressWarnings("rawtypes")
	@Bean
	public Module springDataPageModule() {
		return new SimpleModule().addSerializer(Page.class, new JsonSerializer<Page>() {
			@Override
			public void serialize(Page value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
				gen.writeStartObject();
				gen.writeNumberField("totalElements", value.getTotalElements());
				gen.writeNumberField("totalPages", value.getTotalPages());
				gen.writeNumberField("number", value.getNumber());
				gen.writeNumberField("size", value.getSize());
				gen.writeBooleanField("first", value.isFirst());
				gen.writeBooleanField("last", value.isLast());
				gen.writeFieldName("content");
				serializers.defaultSerializeValue(value.getContent(), gen);
				gen.writeEndObject();
			}
		});
	}

}
