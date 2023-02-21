import morgan from 'morgan';
import logger from '../utils/logger.js';

logger.stream = {
  write: message => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

const loggerHttp = morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream: logger.stream }
);

export default loggerHttp;