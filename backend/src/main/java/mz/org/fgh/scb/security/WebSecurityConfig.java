package mz.org.fgh.scb.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private MyUserDetailsService myUserDetailsService;
	
	@Autowired
	private AuthenticationEntryPoint authEntryPoint;
	
	
	@Override
	public void configure(WebSecurity web) throws Exception {
	    web.ignoring().antMatchers("/*")
	    			  .antMatchers("/i18n/**")
	    			  .antMatchers("/assets/**")
	    			  .antMatchers("/swagger-resources/**")
	    			  .antMatchers("/v2/api-docs/**")
	    			  .antMatchers("/webjars/**");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		try {
			http.csrf().disable();
			http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
			http.authenticationProvider(authenticationProvider())
					.authorizeRequests()
					.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
					.antMatchers("**/login").permitAll()
					//authorities
					.antMatchers(HttpMethod.GET,"**/api/v1/authorities/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//ironkeys
					.antMatchers(HttpMethod.POST,"**/api/v1/ironkeys/**").hasAnyRole("SIS","IT")
					.antMatchers(HttpMethod.PUT,"**/api/v1/ironkeys/**").hasAnyRole("SIS","IT")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/ironkeys/**").hasAnyRole("SIS","IT")
					.antMatchers(HttpMethod.GET,"**/api/v1/ironkeys/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//servers
					.antMatchers(HttpMethod.POST,"**/api/v1/servers/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.PUT,"**/api/v1/servers/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/servers/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.GET,"**/api/v1/servers/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//districts
					.antMatchers(HttpMethod.POST,"**/api/v1/districts/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.PUT,"**/api/v1/districts/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/districts/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.GET,"**/api/v1/districts/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//transporters
					.antMatchers(HttpMethod.POST,"**/api/v1/transporters/**").hasAnyRole("SIS","ODMA","GDD","ORMA")
					.antMatchers(HttpMethod.PUT,"**/api/v1/transporters/**").hasAnyRole("SIS","ODMA","GDD","ORMA")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/transporters/**").hasAnyRole("SIS","ODMA","GDD","ORMA")
					.antMatchers(HttpMethod.GET,"**/api/v1/transporters/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//evaluations
					.antMatchers(HttpMethod.POST,"**/api/v1/evaluations/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.PUT,"**/api/v1/evaluations/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/evaluations/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.GET,"**/api/v1/evaluations/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//users
					.antMatchers(HttpMethod.POST,"**/api/v1/users/**").hasAnyRole("SIS","ODMA","ORMA")
					.antMatchers(HttpMethod.PUT,"**/api/v1/users/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/users/**").hasAnyRole("SIS","ODMA","ORMA")
					.antMatchers(HttpMethod.GET,"**/api/v1/users/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//sends
					.antMatchers(HttpMethod.POST,"**/api/v1/sends/**").hasAnyRole("GDD","ODMA","ORMA","SIS")
					.antMatchers(HttpMethod.PUT,"**/api/v1/sends/**").hasAnyRole("GDD","ODMA","ORMA","SIS")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/sends/**").hasAnyRole("GDD","ODMA","ORMA","SIS")
					.antMatchers(HttpMethod.GET,"**/api/v1/sends/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//syncs
					.antMatchers(HttpMethod.POST,"**/api/v1/syncs/**").hasAnyRole("ODMA","SIS")
					.antMatchers(HttpMethod.PUT,"**/api/v1/syncs/**").hasAnyRole("ODMA","SIS")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/syncs/**").hasAnyRole("ODMA","SIS")
					.antMatchers(HttpMethod.GET,"**/api/v1/syncs/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA","SIS")
					//receives
					.antMatchers(HttpMethod.POST,"**/api/v1/receives/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.PUT,"**/api/v1/receives/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.DELETE,"**/api/v1/receives/**").hasAnyRole("SIS")
					.antMatchers(HttpMethod.GET,"**/api/v1/receives/**").hasAnyRole("SIS","IT","OA","ODMA","GDD","ORMA","GMA")
					//.antMatchers("/**").permitAll()
					.anyRequest().authenticated()
					.and().httpBasic().authenticationEntryPoint(authEntryPoint);
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		}
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(myUserDetailsService);
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(myUserDetailsService);
		authProvider.setPasswordEncoder(encoder());
		return authProvider;
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder(11);
	}

	public MyUserDetailsService getMyUserDetailsService() {
		return myUserDetailsService;
	}

	public void setMyUserDetailsService(MyUserDetailsService myUserDetailsService) {
		this.myUserDetailsService = myUserDetailsService;
	}
}
