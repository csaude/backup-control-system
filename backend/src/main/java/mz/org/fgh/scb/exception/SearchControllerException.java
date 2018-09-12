/**
 * 
 */
package mz.org.fgh.scb.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@SuppressWarnings("serial")
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SearchControllerException extends Exception {

	public SearchControllerException(String message) {
		super(message);
	}

}
