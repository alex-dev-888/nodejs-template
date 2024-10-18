const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const winston = require('winston')
const { combine, timestamp, printf } = winston.format
const moment = require('moment-timezone')
const DailyRotateFile = require('winston-daily-rotate-file')
// const config = require('../config')

// create a logs folder if not exists
const logsDir = process.env.LOGS_DIR || path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

const loggingEnabled = process.env.LOGGING_ENABLED === '1'

// Convert LOG_FILE_MAX_SIZE to number, defaulting to 10MB if not set
const logFileMaxSize =
  Number(process.env.LOG_FILE_MAX_SIZE) * 1024 * 1024 || 10 * 1024 * 1024 // 10 MB

// create a logger for http request, response
const httpLogger = loggingEnabled
  ? winston.createLogger({
      level: 'info',
      format: combine(
        timestamp({
          format: () => {
            return moment()
              .tz('Asia/Ho_Chi_Minh')
              .format('YYYY-MM-DD HH:mm:ss.SSS ZZ')
          },
        }),
        printf((info) => `${info.timestamp} - ${info.message}`)
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: path.join(logsDir, 'access-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: logFileMaxSize,
          maxFiles: undefined,
        }),
      ],
    })
  : null

// create a logger for information
const infoLogger = loggingEnabled
  ? winston.createLogger({
      level: 'info',
      format: combine(
        timestamp({
          format: () => {
            return moment()
              .tz('Asia/Ho_Chi_Minh')
              .format('YYYY-MM-DD HH:mm:ss.SSS ZZ')
          },
        }),
        printf((info) => `${info.timestamp} - ${info.message}`)
      ),
      transports: [
        new DailyRotateFile({
          filename: path.join(logsDir, 'log-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: logFileMaxSize,
          maxFiles: undefined,
        }),
      ],
    })
  : null

// create a logger for error exception
const errorLogger = loggingEnabled
  ? winston.createLogger({
      level: 'error',
      format: combine(
        timestamp({
          format: () => {
            return moment()
              .tz('Asia/Ho_Chi_Minh')
              .format('YYYY-MM-DD HH:mm:ss.SSS ZZ')
          },
        }),
        printf((info) => `${info.timestamp} - ${info.message}`)
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: path.join(logsDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: logFileMaxSize,
          maxFiles: undefined,
        }),
      ],
    })
  : null

// Middleware using morgan to log request, response
const httpLoggerMiddleware = loggingEnabled
  ? morgan('combined', {
      stream: {
        write: (message) => {
          httpLogger.info(message)
        },
      },
    })
  : null

// Middleware processing exception and log to error.log file
const errorLoggerMiddleware = (err, req, res, next) => {
  if (errorLogger) {
    errorLogger.error(err.stack)
  }

  next(err)
}

module.exports = {
  httpLogger,
  infoLogger,
  errorLogger,
  httpLoggerMiddleware,
  errorLoggerMiddleware,
}
