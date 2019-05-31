package mz.org.fgh.scb.server;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mz.org.fgh.scb.user.UserServiceImpl;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@Service
public class ServerServiceImpl implements ServerService {

	@Autowired
	ServerRepository serverRepository;

	@Autowired
	UserServiceImpl userServiceImpl;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public Server findOneByUuid(String uuid) {
		return serverRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public Server save(Server server) {
		if (server.getServerId() == null) {
			server.setDateCreated(new Date());
			server.setDateUpdated(new Date());
			logger.info(server.getCreatedBy().getUid() + ", created " + server.toString());
		} else {
			server.setDateUpdated(new Date());
			if (server.isCanceled() == true) {
				server.setDateCanceled(new Date());
				server.setCanceledBy(server.getUpdatedBy());
			} else {
				server.setCanceledReason(null);
			}
			logger.info(server.getUpdatedBy().getUid() + ", updated " + server.toString());
		}
		return serverRepository.save(server);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Server server) {
		logger.info("Deleted " + server.toString());
		serverRepository.delete(server);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<Server> findAll(Specification<Server> spec, PageRequest pageRequest) {
		return serverRepository.findAll(spec, pageRequest);
	}

}
