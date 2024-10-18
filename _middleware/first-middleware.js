const { infoLogger, errorLogger } = require('../_helpers/logger')

module.exports = (req, res, next) => {
  if (infoLogger) {
    infoLogger.info(`${req.requestId} - First Middleware`)
  }
  next()
}
