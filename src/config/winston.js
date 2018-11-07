const winston = require('winston');

const options = {


  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(info => `${info.level}: ${info.message}`)
    ),
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console)
  ],

  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;


